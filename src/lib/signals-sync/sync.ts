import type { Payload } from 'payload'
import { mapExternalToSignalData } from './mapItem'
import type { ExternalFeedResponse, SignalType } from './types'
import { SIGNAL_TYPES } from './types'

export interface SyncStats {
  fetched: number
  created: number
  updated: number
  skipped: number
}

let running = false

async function getCursor(payload: Payload, kind: SignalType): Promise<number> {
  const res = await payload.find({
    collection: 'signals',
    where: { kind: { equals: kind }, externalCreatedMs: { exists: true } },
    sort: '-externalCreatedMs',
    limit: 1,
    depth: 0,
    draft: false,
  })
  return res.docs[0]?.externalCreatedMs ?? 0
}

async function fetchFeed(kind: SignalType, since: number): Promise<ExternalFeedResponse> {
  const base = process.env.SIGNALS_API_URL
  if (!base) throw new Error('SIGNALS_API_URL is not set')
  const limit = Number(process.env.SIGNALS_SYNC_BATCH_LIMIT ?? 50)
  const url = `${base}?type=${kind}&since=${since}&limit=${limit}`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' })
  if (!res.ok) throw new Error(`Signals API ${res.status} for ${url}`)
  return (await res.json()) as ExternalFeedResponse
}

async function syncType(payload: Payload, kind: SignalType, stats: SyncStats): Promise<void> {
  const since = await getCursor(payload, kind)
  const feed = await fetchFeed(kind, since)
  const items = [...(feed.items ?? [])].sort((a, b) => a.created_ms - b.created_ms)
  stats.fetched += items.length

  for (const item of items) {
    try {
      const data = mapExternalToSignalData(item)
      if (!data) {
        stats.skipped++
        continue
      }
      const existing = await payload.find({
        collection: 'signals',
        where: { externalId: { equals: item.id } },
        limit: 1,
        depth: 0,
        draft: false,
      })
      const found = existing.docs[0]
      if (found) {
        // Cursor overlap re-sends are common; skip no-op writes to avoid version churn.
        if (found.externalCreatedMs === item.created_ms && found.title === data.title) {
          stats.skipped++
          continue
        }
        await payload.update({ collection: 'signals', id: found.id, data })
        stats.updated++
      } else {
        await payload.create({ collection: 'signals', data })
        stats.created++
      }
    } catch (err) {
      payload.logger.error({ err, externalId: item.id }, 'signals-sync: failed to upsert item')
    }
  }
}

/** One polling tick: fetch each signal type since its cursor and upsert. Never throws. */
export async function runSignalsSyncTick(payload: Payload): Promise<SyncStats> {
  const stats: SyncStats = { fetched: 0, created: 0, updated: 0, skipped: 0 }
  if (running) return stats
  running = true
  try {
    for (const kind of SIGNAL_TYPES) {
      try {
        await syncType(payload, kind, stats)
      } catch (err) {
        payload.logger.error({ err, kind }, 'signals-sync: tick failed for type')
      }
    }
    if (stats.created || stats.updated) {
      payload.logger.info(stats, 'signals-sync: ingested new signals')
    }
  } finally {
    running = false
  }
  return stats
}
