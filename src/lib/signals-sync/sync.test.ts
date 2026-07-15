import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Payload } from 'payload'
import { runSignalsSyncTick } from './sync'
import { resetRetentionThrottle } from './retention'
import type { ExternalSignalItem } from './types'

function fakePayload() {
  const created: unknown[] = []
  const payload = {
    find: vi.fn(async () => ({ docs: [], totalDocs: 0 })),
    create: vi.fn(async ({ data }: { data: unknown }) => {
      created.push(data)
      return data
    }),
    update: vi.fn(async () => ({})),
    delete: vi.fn(async () => ({ docs: [] })),
    logger: { info: vi.fn(), error: vi.fn() },
  }
  return { payload: payload as unknown as Payload, created }
}

const whaleItem = (id: string, createdMs: number): ExternalSignalItem => ({
  id,
  type: 'whale',
  created_ms: createdMs,
  fields: { market: `Market ${id}` },
})

describe('runSignalsSyncTick', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    resetRetentionThrottle()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('publishes every fetched item, including just-created ones', async () => {
    const now = Date.now()
    const older = whaleItem('older', now - 25 * 60_000)
    const fresh = whaleItem('fresh', now - 2 * 60_000)
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () => ({ items: String(url).includes('type=whale') ? [older, fresh] : [] }),
      })),
    )
    vi.stubEnv('SIGNALS_API_URL', 'http://signals.test/api')

    const { payload, created } = fakePayload()
    const stats = await runSignalsSyncTick(payload)

    expect(stats.fetched).toBe(2)
    expect(stats.created).toBe(2)
    expect(created.map((d) => (d as { externalId: string }).externalId)).toEqual([
      'older',
      'fresh',
    ])
  })
})
