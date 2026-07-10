import { describe, it, expect } from 'vitest'
import { sitemapShardIds, SITEMAP_SHARD_SIZE } from './sitemapShards'

describe('sitemapShardIds', () => {
  it('returns only the core shard when there is no news', () => {
    expect(sitemapShardIds(0)).toEqual([{ id: 0 }])
  })

  it('adds one news shard per size-worth of posts', () => {
    expect(sitemapShardIds(1, 10)).toEqual([{ id: 0 }, { id: 1 }])
    expect(sitemapShardIds(10, 10)).toEqual([{ id: 0 }, { id: 1 }])
    expect(sitemapShardIds(11, 10)).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }])
  })

  it('uses a 10k default shard size', () => {
    expect(SITEMAP_SHARD_SIZE).toBe(10000)
  })
})
