import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getPublishedSitemapRows, getPublishedSitemapCount } from '@/utilities/sitemapData'
import { sitemapShardIds, SITEMAP_SHARD_SIZE } from '@/utilities/sitemapShards'

export const revalidate = 3600

export async function generateSitemaps() {
  const settings = await getSiteSettings()
  const newsCount = settings.sitemapIncludeNews ? await getPublishedSitemapCount('news') : 0
  return sitemapShardIds(newsCount)
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const settings = await getSiteSettings()

  // News shards (id >= 1): one paginated slice of published news.
  if (id >= 1) {
    if (!settings.sitemapIncludeNews) return []
    const rows = await getPublishedSitemapRows('news', { page: id, limit: SITEMAP_SHARD_SIZE })
    return rows.map((row) => ({
      url: `${base}/news/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  }

  // Core shard (id === 0): static routes + CMS pages + live-feed.
  const [pageRows, liveFeedRows] = await Promise.all([
    getPublishedSitemapRows('pages'),
    settings.sitemapIncludeLiveFeed
      ? getPublishedSitemapRows('live-feed')
      : Promise.resolve([]),
  ])

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  const add = (entry: MetadataRoute.Sitemap[number]) => byUrl.set(entry.url, entry)

  add({ url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 })
  if (settings.sitemapIncludeNews) {
    add({ url: `${base}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeSignals) {
    add({ url: `${base}/signals`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeLiveFeed) {
    add({ url: `${base}/live-feed`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 })
  }
  add({ url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
  add({ url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })

  for (const row of pageRows) {
    if (row.slug === 'home') continue
    add({
      url: `${base}/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const row of liveFeedRows) {
    add({
      url: `${base}/live-feed/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'daily',
      priority: 0.6,
    })
  }

  return [...byUrl.values()]
}
