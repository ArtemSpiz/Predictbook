import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getPublishedSitemapRows, getPublishedSitemapCount } from '@/utilities/sitemapData'
import { SITEMAP_SHARD_SIZE } from '@/utilities/sitemapShards'

export type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: 'weekly' | 'daily' | 'hourly' | 'monthly'
  priority?: number
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function entriesToUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((e) => {
      const parts = [`<loc>${xmlEscape(e.loc)}</loc>`]
      if (e.lastmod) parts.push(`<lastmod>${e.lastmod}</lastmod>`)
      if (e.changefreq) parts.push(`<changefreq>${e.changefreq}</changefreq>`)
      if (e.priority !== undefined) parts.push(`<priority>${e.priority}</priority>`)
      return `<url>${parts.join('')}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
}

export function shardIndexXml(base: string, ids: { id: number }[]): string {
  const body = ids.map(({ id }) => `<sitemap><loc>${base}/sitemap/${id}.xml</loc></sitemap>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}

/** Entries for one shard. id 0 = core (static + CMS pages + live-feed); id>=1 = a page of news. */
export async function buildSitemapShardEntries(id: number): Promise<SitemapEntry[]> {
  const base = getSiteUrl()
  const nowIso = new Date().toISOString()
  const settings = await getSiteSettings()

  if (id >= 1) {
    if (!settings.sitemapIncludeNews) return []
    const rows = await getPublishedSitemapRows('news', { page: id, limit: SITEMAP_SHARD_SIZE })
    return rows.map((row) => ({
      loc: `${base}/news/${row.slug}`,
      lastmod: row.updatedAt ? new Date(row.updatedAt).toISOString() : nowIso,
      changefreq: 'monthly' as const,
      priority: 0.7,
    }))
  }

  const [pageRows, liveFeedRows] = await Promise.all([
    getPublishedSitemapRows('pages'),
    settings.sitemapIncludeLiveFeed ? getPublishedSitemapRows('live-feed') : Promise.resolve([]),
  ])

  const byUrl = new Map<string, SitemapEntry>()
  const add = (e: SitemapEntry) => byUrl.set(e.loc, e)

  add({ loc: `${base}/`, lastmod: nowIso, changefreq: 'weekly', priority: 1 })
  if (settings.sitemapIncludeNews) add({ loc: `${base}/news`, lastmod: nowIso, changefreq: 'daily', priority: 0.8 })
  if (settings.sitemapIncludeSignals) add({ loc: `${base}/signals`, lastmod: nowIso, changefreq: 'daily', priority: 0.8 })
  if (settings.sitemapIncludeLiveFeed) add({ loc: `${base}/live-feed`, lastmod: nowIso, changefreq: 'hourly', priority: 0.8 })
  add({ loc: `${base}/about`, lastmod: nowIso, changefreq: 'monthly', priority: 0.5 })
  add({ loc: `${base}/contact`, lastmod: nowIso, changefreq: 'monthly', priority: 0.5 })

  for (const row of pageRows) {
    if (row.slug === 'home') continue
    add({ loc: `${base}/${row.slug}`, lastmod: row.updatedAt ? new Date(row.updatedAt).toISOString() : nowIso, changefreq: 'monthly', priority: 0.7 })
  }
  for (const row of liveFeedRows) {
    add({ loc: `${base}/live-feed/${row.slug}`, lastmod: row.updatedAt ? new Date(row.updatedAt).toISOString() : nowIso, changefreq: 'daily', priority: 0.6 })
  }
  return [...byUrl.values()]
}

export async function sitemapNewsCount(): Promise<number> {
  const settings = await getSiteSettings()
  return settings.sitemapIncludeNews ? await getPublishedSitemapCount('news') : 0
}
