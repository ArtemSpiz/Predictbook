import { describe, it, expect } from 'vitest'
import { mongoConnectOptions } from './mongoConnectOptions'

describe('mongoConnectOptions', () => {
  it('uses safe defaults when env is empty', () => {
    expect(mongoConnectOptions({})).toEqual({
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  })

  it('reads overrides from env', () => {
    const opts = mongoConnectOptions({
      MONGO_MAX_POOL_SIZE: '25',
      MONGO_MIN_POOL_SIZE: '2',
      MONGO_SERVER_SELECTION_TIMEOUT_MS: '3000',
      MONGO_SOCKET_TIMEOUT_MS: '60000',
    })
    expect(opts).toEqual({
      maxPoolSize: 25,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 60000,
    })
  })

  it('falls back to defaults for non-numeric or negative values', () => {
    const opts = mongoConnectOptions({ MONGO_MAX_POOL_SIZE: 'abc', MONGO_MIN_POOL_SIZE: '-3' })
    expect(opts.maxPoolSize).toBe(10)
    expect(opts.minPoolSize).toBe(0)
  })

  it('falls back to defaults for empty or whitespace-only values', () => {
    expect(mongoConnectOptions({ MONGO_MAX_POOL_SIZE: '', MONGO_MIN_POOL_SIZE: '   ' })).toEqual({
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  })
})
