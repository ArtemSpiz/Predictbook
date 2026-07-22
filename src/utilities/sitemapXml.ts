import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getAllSitemapRows, getSitemapRows, getSitemapCount } from '@/utilities/sitemapData'
import { POSTS_SHARD_SIZE, postsSitemapNames, postsSitemapPage } from '@/utilities/sitemapShards'

export type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: 'weekly' | 'daily' | 'hourly' | 'monthly'
  priority?: number
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const iso = (updatedAt: string | null, fallback: string) =>
  updatedAt ? new Date(updatedAt).toISOString() : fallback

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

export function sitemapIndexXml(base: string, names: string[]): string {
  const body = names
    .map((name) => `<sitemap><loc>${base}/sitemap/${name}</loc></sitemap>`)
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}

/** Child sitemap file names listed by the index, respecting the SiteSettings
 * include flags and omitting sitemaps that would be empty. Categories/Tags live
 * under /analysis, so they follow the news include flag. */
export async function sitemapChildNames(): Promise<string[]> {
  const settings = await getSiteSettings()
  const names: string[] = ['pages.xml']

  if (settings.sitemapIncludeNews) {
    const newsCount = await getSitemapCount('news')
    if (newsCount > 0) names.push(...postsSitemapNames(newsCount))
    if ((await getSitemapCount('categories', false)) > 0) names.push('categories.xml')
    if ((await getSitemapCount('tags', false)) > 0) names.push('tags.xml')
  }
  if (settings.sitemapIncludeLiveFeed && (await getSitemapCount('live-feed')) > 0) {
    names.push('live.xml')
  }
  return names
}

/** Static routes, section indexes, and CMS pages. */
export async function buildPagesEntries(now = new Date().toISOString()): Promise<SitemapEntry[]> {
  const base = getSiteUrl()
  const settings = await getSiteSettings()

  const byUrl = new Map<string, SitemapEntry>()
  const add = (e: SitemapEntry) => byUrl.set(e.loc, e)

  add({ loc: `${base}/`, lastmod: now, changefreq: 'weekly', priority: 1 })
  if (settings.sitemapIncludeNews) add({ loc: `${base}/analysis`, lastmod: now, changefreq: 'daily', priority: 0.8 })
  if (settings.sitemapIncludeSignals) add({ loc: `${base}/signals`, lastmod: now, changefreq: 'daily', priority: 0.8 })
  if (settings.sitemapIncludeLiveFeed) add({ loc: `${base}/live`, lastmod: now, changefreq: 'hourly', priority: 0.8 })
  add({ loc: `${base}/about`, lastmod: now, changefreq: 'monthly', priority: 0.5 })
  add({ loc: `${base}/contact`, lastmod: now, changefreq: 'monthly', priority: 0.5 })

  for (const row of await getAllSitemapRows('pages')) {
    if (row.slug === 'home') continue
    add({ loc: `${base}/${row.slug}`, lastmod: iso(row.updatedAt, now), changefreq: 'monthly', priority: 0.7 })
  }
  return [...byUrl.values()]
}

/** One page of news posts → /analysis/[slug]. */
export async function buildPostsEntries(
  page: number,
  now = new Date().toISOString(),
): Promise<SitemapEntry[]> {
  const settings = await getSiteSettings()
  if (!settings.sitemapIncludeNews) return []
  const base = getSiteUrl()
  const rows = await getSitemapRows('news', { page, limit: POSTS_SHARD_SIZE })
  return rows.map((row) => ({
    loc: `${base}/analysis/${row.slug}`,
    lastmod: iso(row.updatedAt, now),
    changefreq: 'daily' as const,
    priority: 0.7,
  }))
}

/** Category listings → /analysis/[category]. */
export async function buildCategoriesEntries(now = new Date().toISOString()): Promise<SitemapEntry[]> {
  const settings = await getSiteSettings()
  if (!settings.sitemapIncludeNews) return []
  const base = getSiteUrl()
  const rows = await getAllSitemapRows('categories', { requirePublished: false })
  return rows.map((row) => ({
    loc: `${base}/analysis/${row.slug}`,
    lastmod: iso(row.updatedAt, now),
    // The weekly-pulse category is updated weekly; every other category (incl.
    // daily-pulse and the topic categories) turns over daily.
    changefreq: row.slug === 'weekly-pulse' ? ('weekly' as const) : ('daily' as const),
    priority: 0.6,
  }))
}

/** Tag pages → /analysis/tag/[tag]. */
export async function buildTagsEntries(now = new Date().toISOString()): Promise<SitemapEntry[]> {
  const settings = await getSiteSettings()
  if (!settings.sitemapIncludeNews) return []
  const base = getSiteUrl()
  const rows = await getAllSitemapRows('tags', { requirePublished: false })
  return rows.map((row) => ({
    loc: `${base}/analysis/tag/${row.slug}`,
    lastmod: iso(row.updatedAt, now),
    changefreq: 'weekly' as const,
    priority: 0.4,
  }))
}

/** Live-feed threads → /live/[slug]. */
export async function buildLiveEntries(now = new Date().toISOString()): Promise<SitemapEntry[]> {
  const settings = await getSiteSettings()
  if (!settings.sitemapIncludeLiveFeed) return []
  const base = getSiteUrl()
  const rows = await getAllSitemapRows('live-feed')
  return rows.map((row) => ({
    loc: `${base}/live/${row.slug}`,
    lastmod: iso(row.updatedAt, now),
    changefreq: 'hourly' as const,
    priority: 0.6,
  }))
}

/** Resolve a child sitemap file name to its entries, or null if unknown. */
export async function buildSitemapByName(name: string): Promise<SitemapEntry[] | null> {
  const now = new Date().toISOString()
  switch (name) {
    case 'pages.xml':
      return buildPagesEntries(now)
    case 'categories.xml':
      return buildCategoriesEntries(now)
    case 'tags.xml':
      return buildTagsEntries(now)
    case 'live.xml':
      return buildLiveEntries(now)
  }
  const postsPage = postsSitemapPage(name)
  return postsPage !== null ? buildPostsEntries(postsPage, now) : null
}
