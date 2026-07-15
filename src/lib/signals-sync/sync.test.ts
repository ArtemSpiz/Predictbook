import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Payload } from 'payload'
import { publishCutoffMs, runSignalsSyncTick } from './sync'
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

describe('publishCutoffMs', () => {
  beforeEach(() => vi.unstubAllEnvs())

  it('defaults to a 30-minute window', () => {
    expect(publishCutoffMs(100 * 60_000)).toBe(70 * 60_000)
  })

  it('honors SIGNALS_PUBLISH_DELAY_MINUTES', () => {
    vi.stubEnv('SIGNALS_PUBLISH_DELAY_MINUTES', '10')
    expect(publishCutoffMs(100 * 60_000)).toBe(90 * 60_000)
  })

  it('publishes immediately when set to 0', () => {
    vi.stubEnv('SIGNALS_PUBLISH_DELAY_MINUTES', '0')
    expect(publishCutoffMs(12345)).toBe(12345)
  })
})

describe('runSignalsSyncTick publish delay', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    resetRetentionThrottle()
  })

  it('withholds items younger than the delay window', async () => {
    const now = Date.now()
    const old = whaleItem('old', now - 45 * 60_000)
    const fresh = whaleItem('fresh', now - 5 * 60_000)
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () => ({ items: String(url).includes('type=whale') ? [old, fresh] : [] }),
      })),
    )
    vi.stubEnv('SIGNALS_API_URL', 'http://signals.test/api')

    const { payload, created } = fakePayload()
    const stats = await runSignalsSyncTick(payload)

    expect(stats.fetched).toBe(2)
    expect(stats.withheld).toBe(1)
    expect(stats.created).toBe(1)
    expect(created).toHaveLength(1)
    expect((created[0] as { externalId: string }).externalId).toBe('old')

    vi.unstubAllGlobals()
  })
})
