import { describe, it, expect } from 'vitest'
import { entriesToUrlset, sitemapIndexXml } from './sitemapXml'

describe('entriesToUrlset', () => {
  it('wraps entries in a urlset and escapes ampersands in loc', () => {
    const xml = entriesToUrlset([{ loc: 'https://x.test/a?b=1&c=2', changefreq: 'daily', priority: 0.8 }])
    expect(xml).toContain('<urlset')
    expect(xml).toContain('<loc>https://x.test/a?b=1&amp;c=2</loc>')
    expect(xml).toContain('<changefreq>daily</changefreq>')
    expect(xml).toContain('<priority>0.8</priority>')
  })

  it('escapes <, >, and " in loc', () => {
    const xml = entriesToUrlset([{ loc: 'https://x.test/a<b>"c"' }])
    expect(xml).toContain('<loc>https://x.test/a&lt;b&gt;&quot;c&quot;</loc>')
  })
})

describe('sitemapIndexXml', () => {
  it('lists one <sitemap> per child sitemap name', () => {
    const xml = sitemapIndexXml('https://x.test', ['pages.xml', 'posts.xml'])
    expect(xml).toContain('<sitemapindex')
    expect(xml).toContain('<loc>https://x.test/sitemap/pages.xml</loc>')
    expect(xml).toContain('<loc>https://x.test/sitemap/posts.xml</loc>')
  })
})
