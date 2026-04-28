import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@payloadcms/storage-s3', () => ({
  s3Storage: vi.fn((opts) => ({ __kind: 's3', opts })),
}))
vi.mock('@payloadcms/storage-gcs', () => ({
  gcsStorage: vi.fn((opts) => ({ __kind: 'gcs', opts })),
}))
vi.mock('@payloadcms/storage-vercel-blob', () => ({
  vercelBlobStorage: vi.fn((opts) => ({ __kind: 'vercel', opts })),
}))

import { resolveStorageAdapter } from './storage'

const STORAGE_ENV = [
  'S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY',
  'GCS_BUCKET', 'BLOB_READ_WRITE_TOKEN',
]

describe('resolveStorageAdapter', () => {
  beforeEach(() => {
    for (const k of STORAGE_ENV) delete process.env[k]
  })

  it('returns null for local provider', () => {
    expect(resolveStorageAdapter({ provider: 'local' })).toBeNull()
  })

  it('returns s3 plugin for s3 provider', () => {
    process.env.S3_BUCKET = 'b'
    process.env.S3_REGION = 'us-east-1'
    process.env.S3_ACCESS_KEY_ID = 'k'
    process.env.S3_SECRET_ACCESS_KEY = 's'
    const a = resolveStorageAdapter({ provider: 's3' })
    expect((a as { __kind: string }).__kind).toBe('s3')
  })

  it('returns gcs plugin for gcs provider', () => {
    process.env.GCS_BUCKET = 'b'
    const a = resolveStorageAdapter({ provider: 'gcs' })
    expect((a as { __kind: string }).__kind).toBe('gcs')
  })

  it('returns vercel-blob plugin for vercel-blob provider', () => {
    process.env.BLOB_READ_WRITE_TOKEN = 't'
    const a = resolveStorageAdapter({ provider: 'vercel-blob' })
    expect((a as { __kind: string }).__kind).toBe('vercel')
  })

  it('throws when s3 env vars missing', () => {
    expect(() => resolveStorageAdapter({ provider: 's3' })).toThrow(/S3_BUCKET/)
  })
})
