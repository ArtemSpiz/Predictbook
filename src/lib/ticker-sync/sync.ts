import type { Payload } from 'payload'
import type { Ticker } from '@/payload-types'
import { fetchKalshiTop } from './kalshi'
import { fetchPolymarketTop } from './polymarket'
import type { TickerRowData, TickerVenue } from './types'

export interface TickerSyncStats {
  fetched: number
  created: number
  updated: number
  deleted: number
  skipped: number
}

const VENUE_PREFIX: Record<TickerVenue, string> = {
  Polymarket: 'poly:',
  Kalshi: 'kalshi:',
}

// Manual admin rows keep their default order 0 and stay ahead of synced rows.
const ORDER_BASE = 10
const ORDER_STEP = 10

let running = false

/** Alternate venues (poly, kalshi, poly, …) so one venue's volume doesn't front-load the strip. */
export function interleaveRows(a: TickerRowData[], b: TickerRowData[]): TickerRowData[] {
  const rows: TickerRowData[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) rows.push(a[i])
    if (b[i]) rows.push(b[i])
  }
  return rows.map((row, i) => ({ ...row, order: ORDER_BASE + i * ORDER_STEP }))
}

async function upsertRows(
  payload: Payload,
  rows: TickerRowData[],
  stats: TickerSyncStats,
): Promise<void> {
  for (const row of rows) {
    try {
      const existing = await payload.find({
        collection: 'ticker',
        where: { externalId: { equals: row.externalId } },
        limit: 1,
        depth: 0,
      })
      const found = existing.docs[0]
      if (found) {
        if (found.market === row.market && found.price === row.price && found.order === row.order) {
          stats.skipped++
          continue
        }
        await payload.update({ collection: 'ticker', id: found.id, data: row })
        stats.updated++
      } else {
        await payload.create({ collection: 'ticker', data: row })
        stats.created++
      }
    } catch (err) {
      payload.logger.error({ err, externalId: row.externalId }, 'ticker-sync: failed to upsert row')
    }
  }
}

/** Remove synced rows of a venue that fell out of its fresh top-N. Manual rows are untouched. */
async function deleteStaleRows(
  payload: Payload,
  venue: TickerVenue,
  freshIds: Set<string>,
  stats: TickerSyncStats,
): Promise<void> {
  const prefix = VENUE_PREFIX[venue]
  const res = await payload.find({
    collection: 'ticker',
    where: { externalId: { like: prefix } },
    limit: 200,
    depth: 0,
    pagination: false,
  })
  const stale = (res.docs as Ticker[]).filter(
    (doc) => doc.externalId?.startsWith(prefix) && !freshIds.has(doc.externalId),
  )
  for (const doc of stale) {
    try {
      await payload.delete({ collection: 'ticker', id: doc.id })
      stats.deleted++
    } catch (err) {
      payload.logger.error({ err, externalId: doc.externalId }, 'ticker-sync: failed to delete row')
    }
  }
}

/** One polling tick: fetch top markets from both venues and reconcile the ticker collection. Never throws. */
export async function runTickerSyncTick(payload: Payload): Promise<TickerSyncStats> {
  const stats: TickerSyncStats = { fetched: 0, created: 0, updated: 0, deleted: 0, skipped: 0 }
  if (running) return stats
  running = true
  try {
    const limit = Number(process.env.TICKER_SYNC_LIMIT_PER_VENUE ?? 10)
    const [polyResult, kalshiResult] = await Promise.allSettled([
      fetchPolymarketTop(limit),
      fetchKalshiTop(limit),
    ])

    if (polyResult.status === 'rejected') {
      payload.logger.error({ err: polyResult.reason }, 'ticker-sync: Polymarket fetch failed')
    }
    if (kalshiResult.status === 'rejected') {
      payload.logger.error({ err: kalshiResult.reason }, 'ticker-sync: Kalshi fetch failed')
    }

    const poly = polyResult.status === 'fulfilled' ? polyResult.value : []
    const kalshi = kalshiResult.status === 'fulfilled' ? kalshiResult.value : []
    stats.fetched = poly.length + kalshi.length

    await upsertRows(payload, interleaveRows(poly, kalshi), stats)

    // Only clean up venues whose fetch succeeded — stale prices beat a blanked ticker.
    if (polyResult.status === 'fulfilled' && poly.length > 0) {
      await deleteStaleRows(payload, 'Polymarket', new Set(poly.map((r) => r.externalId)), stats)
    }
    if (kalshiResult.status === 'fulfilled' && kalshi.length > 0) {
      await deleteStaleRows(payload, 'Kalshi', new Set(kalshi.map((r) => r.externalId)), stats)
    }

    if (stats.created || stats.updated || stats.deleted) {
      payload.logger.info(stats, 'ticker-sync: reconciled ticker rows')
    }
  } finally {
    running = false
  }
  return stats
}
