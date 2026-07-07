import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@payloadcms/db-postgres', () => ({
  postgresAdapter: vi.fn((opts) => ({ __kind: 'postgres', opts })),
}))
vi.mock('@payloadcms/db-sqlite', () => ({
  sqliteAdapter: vi.fn((opts) => ({ __kind: 'sqlite', opts })),
}))

import { resolveDbAdapter } from './db'

describe('resolveDbAdapter', () => {
  beforeEach(() => {
    delete (process.env as Record<string, string | undefined>).DATABASE_URL
  })

  it('returns postgres adapter when provider is postgres', () => {
    process.env.DATABASE_URL = 'postgres://x/y'
    const a = resolveDbAdapter({ provider: 'postgres' })
    expect((a as unknown as { __kind: string }).__kind).toBe('postgres')
  })

  it('returns sqlite adapter when provider is sqlite', () => {
    process.env.DATABASE_URL = 'file:./local.db'
    const a = resolveDbAdapter({ provider: 'sqlite' })
    expect((a as unknown as { __kind: string }).__kind).toBe('sqlite')
  })

  it('falls back to sqlite when DATABASE_URL is missing', () => {
    const a = resolveDbAdapter({ provider: 'postgres' })
    expect((a as unknown as { __kind: string }).__kind).toBe('sqlite')
  })
})
