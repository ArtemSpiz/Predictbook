#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Backfill yesVenue/noVenue (arbitrage) and side (whale) on signals that were
 * synced before those fields existed. Re-reads the external feed and re-maps
 * each item with the current mapItem logic, updating the matching signal by
 * externalId. Idempotent: only fills fields that are currently empty.
 *
 *   pnpm dlx tsx --env-file=.env scripts/backfill-signal-fields.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { mapExternalToSignalData } from '../src/lib/signals-sync/mapItem'
import type { ExternalFeedResponse, SignalType } from '../src/lib/signals-sync/types'

const BASE = process.env.SIGNALS_API_URL
const PAGE = 200
const MAX_PAGES = 50

async function fetchPage(kind: SignalType, since: number): Promise<ExternalFeedResponse> {
  const url = `${BASE}?type=${kind}&since=${since}&limit=${PAGE}`
  const res = await fetch(url, { cache: 'no-store' } as any)
  if (!res.ok) throw new Error(`feed ${res.status} for type=${kind}`)
  return (await res.json()) as ExternalFeedResponse
}

async function main() {
  if (!BASE) throw new Error('SIGNALS_API_URL is not set')
  const payload = await getPayload({ config })

  let updated = 0
  let seen = 0
  for (const kind of ['arbitrage', 'whale'] as SignalType[]) {
    let since = 0
    for (let page = 0; page < MAX_PAGES; page++) {
      const feed = await fetchPage(kind, since)
      const items = feed.items ?? []
      if (items.length === 0) break

      for (const item of items) {
        seen++
        const mapped = mapExternalToSignalData(item)
        if (!mapped) continue

        const { docs } = await payload.find({
          collection: 'signals',
          where: { externalId: { equals: item.id } },
          limit: 1,
          overrideAccess: true,
          depth: 0,
        })
        const doc = docs[0] as any
        if (!doc) continue

        const patch: Record<string, string> = {}
        if (mapped.yesVenue && !doc.yesVenue) patch.yesVenue = mapped.yesVenue
        if (mapped.noVenue && !doc.noVenue) patch.noVenue = mapped.noVenue
        if (mapped.side && !doc.side) patch.side = mapped.side
        if (Object.keys(patch).length === 0) continue

        await payload.update({ collection: 'signals', id: doc.id, data: patch, overrideAccess: true })
        updated++
      }

      if (feed.next_since == null) break
      since = feed.next_since
    }
  }

  console.log(`[backfill-signal-fields] feed items seen: ${seen}, signals updated: ${updated}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
