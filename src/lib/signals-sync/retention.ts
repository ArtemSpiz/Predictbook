import type { Payload, Where } from 'payload'

export interface RetentionStats {
  deletedByAge: number
  deletedByCount: number
}

// Manual signals (no externalId) and featured ones are never pruned.
const PRUNABLE: Where[] = [
  { externalId: { exists: true } },
  { featured: { not_equals: true } },
]

const PRUNE_EVERY_MS = 60 * 60 * 1000
let lastPruneMs = 0

async function deleteWhere(payload: Payload, conditions: Where[]): Promise<number> {
  const res = await payload.delete({
    collection: 'signals',
    where: { and: conditions },
    depth: 0,
  })
  return res.docs.length
}

/**
 * Prune old synced signals so the collection stays bounded: drop everything
 * older than SIGNALS_RETENTION_DAYS, then trim beyond the newest
 * SIGNALS_RETENTION_LIMIT. Runs at most once per hour; never throws.
 */
export async function runSignalsRetention(payload: Payload): Promise<RetentionStats> {
  const stats: RetentionStats = { deletedByAge: 0, deletedByCount: 0 }
  const now = Date.now()
  if (now - lastPruneMs < PRUNE_EVERY_MS) return stats
  lastPruneMs = now

  const days = Number(process.env.SIGNALS_RETENTION_DAYS ?? 30)
  const limit = Number(process.env.SIGNALS_RETENTION_LIMIT ?? 1000)

  try {
    if (days > 0) {
      const cutoff = new Date(now - days * 24 * 60 * 60 * 1000).toISOString()
      stats.deletedByAge = await deleteWhere(payload, [
        ...PRUNABLE,
        { publishedAt: { less_than: cutoff } },
      ])
    }

    if (limit > 0) {
      const counted = await payload.find({
        collection: 'signals',
        where: { and: PRUNABLE },
        limit: 1,
        depth: 0,
        draft: false,
      })
      if (counted.totalDocs > limit) {
        // The (limit+1)-th newest doc marks the boundary; everything at or past it goes.
        const boundary = await payload.find({
          collection: 'signals',
          where: { and: PRUNABLE },
          sort: '-publishedAt',
          limit: 1,
          page: limit + 1,
          depth: 0,
          draft: false,
        })
        const boundaryAt = boundary.docs[0]?.publishedAt
        if (boundaryAt) {
          stats.deletedByCount = await deleteWhere(payload, [
            ...PRUNABLE,
            { publishedAt: { less_than_equal: boundaryAt } },
          ])
        }
      }
    }

    if (stats.deletedByAge || stats.deletedByCount) {
      payload.logger.info(stats, 'signals-sync: pruned old signals')
    }
  } catch (err) {
    payload.logger.error({ err }, 'signals-sync: retention failed')
  }
  return stats
}

/** Test hook: reset the hourly throttle. */
export function resetRetentionThrottle(): void {
  lastPruneMs = 0
}
