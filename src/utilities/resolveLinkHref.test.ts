import { describe, it, expect } from 'vitest'
import { resolveLinkHref } from './resolveLinkHref'

describe('resolveLinkHref', () => {
  it('returns the custom url', () => {
    expect(resolveLinkHref({ type: 'custom', url: '/analysis/politics' })).toBe(
      '/analysis/politics',
    )
  })
  it('resolves a page reference to /slug', () => {
    expect(
      resolveLinkHref({ type: 'reference', reference: { relationTo: 'pages', value: { slug: 'about' } } }),
    ).toBe('/about')
  })
  it('resolves a news reference to /analysis/slug', () => {
    expect(
      resolveLinkHref({ type: 'reference', reference: { relationTo: 'news', value: { slug: 'hello' } } }),
    ).toBe('/analysis/hello')
  })
  it('falls back to # when empty', () => {
    expect(resolveLinkHref(undefined)).toBe('#')
    expect(resolveLinkHref({ type: 'custom' })).toBe('#')
  })
})
