#!/usr/bin/env tsx
/**
 * One-off backfill: populate `platform` and `address` on existing whale signals.
 *
 * The regular sync tick can't do this — it fetches only items newer than the
 * cursor and skips no-op writes when externalCreatedMs + title are unchanged.
 * So we re-walk the whole whale feed from since=0, map the fields per externalId,
 * and update only rows that are missing them. Run: pnpm tsx --env-file=.env scripts/backfill-whale-platform.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { mapExternalToSignalData, isWalletAddress } from '../src/lib/signals-sync/mapItem'
import type { ExternalFeedResponse } from '../src/lib/signals-sync/types'

async function fetchWhaleFeed(since: number, limit: number): Promise<ExternalFeedResponse> {
  const base = process.env.SIGNALS_API_URL
  if (!base) throw new Error('SIGNALS_API_URL is not set')
  const url = `${base}?type=whale&since=${since}&limit=${limit}`
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' })
  if (!res.ok) throw new Error(`Signals API ${res.status} for ${url}`)
  return (await res.json()) as ExternalFeedResponse
}

async function main() {
  const payload = await getPayload({ config })

  // Walk the entire whale feed, building externalId -> { platform, address }.
  const byId = new Map<string, { platform?: string; address?: string }>()
  let since = 0
  const limit = 200
  for (let guard = 0; guard < 500; guard++) {
    const feed = await fetchWhaleFeed(since, limit)
    const items = feed.items ?? []
    if (items.length === 0) break
    for (const item of items) {
      const data = mapExternalToSignalData(item)
      if (data?.platform || data?.address) {
        byId.set(item.id, { platform: data.platform, address: data.address })
      }
    }
    const maxCreated = Math.max(...items.map((i) => i.created_ms))
    const next = feed.next_since ?? maxCreated + 1
    if (next <= since) break
    since = next
    if (items.length < limit) break
  }
  console.info(`[backfill] collected fields for ${byId.size} whale items from feed`)

  // Update existing whale signals that are missing platform or address.
  let updated = 0
  let missingFeed = 0
  let page = 1
  for (;;) {
    const res = await payload.find({
      collection: 'signals',
      where: { kind: { equals: 'whale' } },
      limit: 100,
      page,
      depth: 0,
      draft: false,
      pagination: true,
    })
    for (const doc of res.docs) {
      const d = doc as {
        id: string
        platform?: string | null
        address?: string | null
        externalId?: string | null
      }
      const feed = d.externalId ? byId.get(d.externalId) : undefined
      if (!feed) {
        missingFeed++
        continue
      }
      const data: { platform?: string; address?: string | null } = {}
      if (!d.platform && feed.platform) data.platform = feed.platform
      // Set a real wallet address; clear any placeholder ('Unknown', 'N/A …') stored earlier.
      if (feed.address && d.address !== feed.address) data.address = feed.address
      else if (!feed.address && d.address && !isWalletAddress(d.address)) data.address = null
      if (Object.keys(data).length === 0) continue
      await payload.update({ collection: 'signals', id: d.id, data })
      updated++
    }
    if (!res.hasNextPage) break
    page++
  }

  console.info(`[backfill] updated ${updated} signals; ${missingFeed} not found in feed`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[backfill] failed:', err)
  process.exit(1)
})
