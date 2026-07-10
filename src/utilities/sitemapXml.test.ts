import { describe, it, expect } from 'vitest'
import { entriesToUrlset, shardIndexXml } from './sitemapXml'

describe('entriesToUrlset', () => {
  it('wraps entries in a urlset and escapes ampersands in loc', () => {
    const xml = entriesToUrlset([{ loc: 'https://x.test/a?b=1&c=2', changefreq: 'daily', priority: 0.8 }])
    expect(xml).toContain('<urlset')
    expect(xml).toContain('<loc>https://x.test/a?b=1&amp;c=2</loc>')
    expect(xml).toContain('<changefreq>daily</changefreq>')
    expect(xml).toContain('<priority>0.8</priority>')
  })
})

describe('shardIndexXml', () => {
  it('lists one <sitemap> per shard id', () => {
    const xml = shardIndexXml('https://x.test', [{ id: 0 }, { id: 1 }])
    expect(xml).toContain('<sitemapindex')
    expect(xml).toContain('<loc>https://x.test/sitemap/0.xml</loc>')
    expect(xml).toContain('<loc>https://x.test/sitemap/1.xml</loc>')
  })
})
