#!/usr/bin/env tsx
/**
 * One-off backfill: populate `platform` on existing whale signals.
 *
 * The regular sync tick can't do this — it fetches only items newer than the
 * cursor and skips no-op writes when externalCreatedMs + title are unchanged.
 * So we re-walk the whole whale feed from since=0, map platform per externalId,
 * and update only rows that are missing it. Run: pnpm tsx --env-file=.env scripts/backfill-whale-platform.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { mapExternalToSignalData } from '../src/lib/signals-sync/mapItem'
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

  // Walk the entire whale feed, building externalId -> platform.
  const platformById = new Map<string, string>()
  let since = 0
  const limit = 200
  for (let guard = 0; guard < 500; guard++) {
    const feed = await fetchWhaleFeed(since, limit)
    const items = feed.items ?? []
    if (items.length === 0) break
    for (const item of items) {
      const data = mapExternalToSignalData(item)
      if (data?.platform) platformById.set(item.id, data.platform)
    }
    const maxCreated = Math.max(...items.map((i) => i.created_ms))
    const next = feed.next_since ?? maxCreated + 1
    if (next <= since) break
    since = next
    if (items.length < limit) break
  }
  console.info(`[backfill] collected platform for ${platformById.size} whale items from feed`)

  // Update existing whale signals that are missing platform.
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
      const d = doc as { id: string; platform?: string | null; externalId?: string | null }
      if (d.platform) continue
      const platform = d.externalId ? platformById.get(d.externalId) : undefined
      if (!platform) {
        missingFeed++
        continue
      }
      await payload.update({ collection: 'signals', id: d.id, data: { platform } })
      updated++
    }
    if (!res.hasNextPage) break
    page++
  }

  console.info(`[backfill] updated ${updated} signals; ${missingFeed} had no platform in feed`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[backfill] failed:', err)
  process.exit(1)
})
