import { describe, it, expect } from 'vitest'
import { POSTS_SHARD_SIZE, postsSitemapNames, postsSitemapPage } from './sitemapShards'

describe('postsSitemapNames', () => {
  it('uses a single posts.xml when within one shard', () => {
    expect(postsSitemapNames(0)).toEqual(['posts.xml'])
    expect(postsSitemapNames(1, 10)).toEqual(['posts.xml'])
    expect(postsSitemapNames(10, 10)).toEqual(['posts.xml'])
  })

  it('splits into numbered shards past the shard size', () => {
    expect(postsSitemapNames(11, 10)).toEqual(['posts-1.xml', 'posts-2.xml'])
    expect(postsSitemapNames(25, 10)).toEqual(['posts-1.xml', 'posts-2.xml', 'posts-3.xml'])
  })

  it('defaults the shard size under the 50k-URL limit', () => {
    expect(POSTS_SHARD_SIZE).toBeLessThanOrEqual(50000)
  })
})

describe('postsSitemapPage', () => {
  it('maps posts.xml to page 1', () => {
    expect(postsSitemapPage('posts.xml')).toBe(1)
  })

  it('maps numbered shards to their page', () => {
    expect(postsSitemapPage('posts-1.xml')).toBe(1)
    expect(postsSitemapPage('posts-3.xml')).toBe(3)
  })

  it('returns null for non-posts names', () => {
    expect(postsSitemapPage('pages.xml')).toBeNull()
    expect(postsSitemapPage('categories.xml')).toBeNull()
    expect(postsSitemapPage('nonsense')).toBeNull()
  })
})
