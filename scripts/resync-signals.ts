#!/usr/bin/env tsx
/**
 * One-off full resync: re-map every existing synced signal (whale + arbitrage)
 * from the external feed and apply the latest mapping to all of its fields.
 *
 * The regular sync tick can't do this — it fetches only items newer than the
 * cursor and skips no-op writes. Here we walk each feed from since=0, re-map by
 * externalId, and overwrite matching docs (clearing address placeholders that an
 * older mapping stored). Run: pnpm tsx --env-file=.env scripts/resync-signals.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { mapExternalToSignalData, type MappedSignalData } from '../src/lib/signals-sync/mapItem'
import type { ExternalFeedResponse, SignalType } from '../src/lib/signals-sync/types'
import { SIGNAL_TYPES } from '../src/lib/signals-sync/types'

async function fetchFeed(kind: SignalType, since: number, limit: number): Promise<ExternalFeedResponse> {
  const base = process.env.SIGNALS_API_URL
  if (!base) throw new Error('SIGNALS_API_URL is not set')
  const url = `${base}?type=${kind}&since=${since}&limit=${limit}`
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' })
  if (!res.ok) throw new Error(`Signals API ${res.status} for ${url}`)
  return (await res.json()) as ExternalFeedResponse
}

async function main() {
  const payload = await getPayload({ config })

  // Walk every feed, building externalId -> latest mapped data.
  const mappedById = new Map<string, MappedSignalData>()
  const limit = 200
  for (const kind of SIGNAL_TYPES) {
    let since = 0
    for (let guard = 0; guard < 500; guard++) {
      const feed = await fetchFeed(kind, since, limit)
      const items = feed.items ?? []
      if (items.length === 0) break
      for (const item of items) {
        const data = mapExternalToSignalData(item)
        if (data) mappedById.set(item.id, data)
      }
      const maxCreated = Math.max(...items.map((i) => i.created_ms))
      const next = feed.next_since ?? maxCreated + 1
      if (next <= since) break
      since = next
      if (items.length < limit) break
    }
  }
  console.info(`[resync] mapped ${mappedById.size} items across ${SIGNAL_TYPES.join(', ')}`)

  // Overwrite every existing synced signal with its latest mapping.
  let updated = 0
  let missingFeed = 0
  let page = 1
  for (;;) {
    const res = await payload.find({
      collection: 'signals',
      where: { externalId: { exists: true } },
      limit: 100,
      page,
      depth: 0,
      draft: false,
      pagination: true,
    })
    for (const doc of res.docs) {
      const d = doc as { id: string; externalId?: string | null }
      const mapped = d.externalId ? mappedById.get(d.externalId) : undefined
      if (!mapped) {
        missingFeed++
        continue
      }
      // undefined is ignored by payload.update; use explicit null to clear a dropped address.
      const data = { ...mapped, address: mapped.address ?? null }
      await payload.update({ collection: 'signals', id: d.id, data })
      updated++
    }
    if (!res.hasNextPage) break
    page++
  }

  console.info(`[resync] updated ${updated} signals; ${missingFeed} not present in feed`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[resync] failed:', err)
  process.exit(1)
})
