import { describe, it, expect } from 'vitest'
import { cacheTags } from './cacheTags'

describe('cacheTags', () => {
  it('exposes the coarse fallback tag', () => {
    expect(cacheTags.all).toBe('payload')
  })

  it('builds collection tags', () => {
    expect(cacheTags.collection('news')).toBe('payload:col:news')
    expect(cacheTags.collection('live-feed')).toBe('payload:col:live-feed')
  })

  it('builds doc-slug tags', () => {
    expect(cacheTags.docSlug('news', 'my-post')).toBe('payload:slug:news:my-post')
  })

  it('builds global tags', () => {
    expect(cacheTags.global('site-settings')).toBe('payload:global:site-settings')
  })
})
