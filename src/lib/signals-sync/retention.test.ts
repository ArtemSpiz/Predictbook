import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Payload, Where } from 'payload'
import { runSignalsRetention, resetRetentionThrottle } from './retention'

interface FakeDoc {
  id: string
  publishedAt: string
}

function fakePayload(docs: FakeDoc[]) {
  const find = vi.fn(async ({ sort, page = 1, limit }: { sort?: string; page?: number; limit: number }) => {
    const sorted = [...docs].sort((a, b) =>
      sort === '-publishedAt' ? b.publishedAt.localeCompare(a.publishedAt) : 0,
    )
    const start = (page - 1) * limit
    return { docs: sorted.slice(start, start + limit), totalDocs: docs.length }
  })
  const del = vi.fn(async ({ where }: { where: Where }) => {
    const conditions = (where.and ?? []) as Where[]
    const deleted = docs.filter((d) =>
      conditions.every((c) => {
        if (c.publishedAt && 'less_than' in c.publishedAt) {
          return d.publishedAt < String(c.publishedAt.less_than)
        }
        if (c.publishedAt && 'less_than_equal' in c.publishedAt) {
          return d.publishedAt <= String(c.publishedAt.less_than_equal)
        }
        return true
      }),
    )
    return { docs: deleted }
  })
  return {
    payload: {
      find,
      delete: del,
      logger: { info: vi.fn(), error: vi.fn() },
    } as unknown as Payload,
    find,
    delete: del,
  }
}

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

describe('runSignalsRetention', () => {
  beforeEach(() => {
    resetRetentionThrottle()
    vi.unstubAllEnvs()
  })

  it('deletes signals older than SIGNALS_RETENTION_DAYS', async () => {
    vi.stubEnv('SIGNALS_RETENTION_DAYS', '30')
    vi.stubEnv('SIGNALS_RETENTION_LIMIT', '1000')
    const { payload } = fakePayload([
      { id: 'old', publishedAt: daysAgo(45) },
      { id: 'fresh', publishedAt: daysAgo(1) },
    ])
    const stats = await runSignalsRetention(payload)
    expect(stats.deletedByAge).toBe(1)
    expect(stats.deletedByCount).toBe(0)
  })

  it('trims beyond SIGNALS_RETENTION_LIMIT using the boundary doc', async () => {
    vi.stubEnv('SIGNALS_RETENTION_DAYS', '0')
    vi.stubEnv('SIGNALS_RETENTION_LIMIT', '2')
    const { payload, find } = fakePayload([
      { id: 'a', publishedAt: daysAgo(1) },
      { id: 'b', publishedAt: daysAgo(2) },
      { id: 'c', publishedAt: daysAgo(3) },
      { id: 'd', publishedAt: daysAgo(4) },
    ])
    const stats = await runSignalsRetention(payload)
    expect(stats.deletedByCount).toBe(2)
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }))
  })

  it('does nothing under the limit and throttles repeat runs', async () => {
    vi.stubEnv('SIGNALS_RETENTION_DAYS', '30')
    vi.stubEnv('SIGNALS_RETENTION_LIMIT', '1000')
    const { payload, delete: del } = fakePayload([{ id: 'a', publishedAt: daysAgo(1) }])
    let stats = await runSignalsRetention(payload)
    expect(stats).toEqual({ deletedByAge: 0, deletedByCount: 0 })
    const callsAfterFirst = del.mock.calls.length

    stats = await runSignalsRetention(payload)
    expect(del.mock.calls.length).toBe(callsAfterFirst)
  })

  it('never throws when payload calls fail', async () => {
    vi.stubEnv('SIGNALS_RETENTION_DAYS', '30')
    const { payload } = fakePayload([])
    ;(payload.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('db down'))
    await expect(runSignalsRetention(payload)).resolves.toEqual({
      deletedByAge: 0,
      deletedByCount: 0,
    })
  })
})
