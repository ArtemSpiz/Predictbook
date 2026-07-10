import { describe, it, expect } from 'vitest'
import { collectionRevalidationTags, globalRevalidationTags } from './revalidateFrontCache'

describe('collectionRevalidationTags', () => {
  it('returns the collection tag plus the doc-slug tag when a slug exists', () => {
    expect(collectionRevalidationTags('news', { slug: 'my-post' })).toEqual([
      'payload:col:news',
      'payload:slug:news:my-post',
    ])
  })

  it('returns only the collection tag when the doc has no slug', () => {
    expect(collectionRevalidationTags('news', {})).toEqual(['payload:col:news'])
  })

  it('returns only the collection tag when doc is undefined', () => {
    expect(collectionRevalidationTags('news', undefined)).toEqual(['payload:col:news'])
  })

  it('coarse-flushes for media (embedded across many docs)', () => {
    expect(collectionRevalidationTags('media', { slug: 'x' })).toEqual(['payload'])
  })
})

describe('globalRevalidationTags', () => {
  it('returns the global tag', () => {
    expect(globalRevalidationTags('site-settings')).toEqual(['payload:global:site-settings'])
  })
})
