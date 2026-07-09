import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getPublishedSitemapRows } from '@/utilities/sitemapData'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const settings = await getSiteSettings()

  const [pageRows, blogRows, caseRows, liveFeedRows] = await Promise.all([
    getPublishedSitemapRows('pages'),
    settings.sitemapIncludeBlog ? getPublishedSitemapRows('blog') : Promise.resolve([]),
    settings.sitemapIncludeCaseStudies
      ? getPublishedSitemapRows('case-studies')
      : Promise.resolve([]),
    settings.sitemapIncludeLiveFeed ? getPublishedSitemapRows('live-feed') : Promise.resolve([]),
  ])

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  const add = (entry: MetadataRoute.Sitemap[number]) => byUrl.set(entry.url, entry)

  // Home + section index pages
  add({ url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 })
  if (settings.sitemapIncludeBlog) {
    add({ url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeCaseStudies) {
    add({
      url: `${base}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  if (settings.sitemapIncludeSignals) {
    add({ url: `${base}/signals`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeLiveFeed) {
    add({ url: `${base}/live-feed`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 })
  }
  // Static content pages
  add({ url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
  add({ url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })

  // CMS pages (skip a page literally slugged "home" — it maps to `/`)
  for (const row of pageRows) {
    if (row.slug === 'home') continue
    add({
      url: `${base}/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const row of blogRows) {
    add({
      url: `${base}/blog/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const row of caseRows) {
    add({
      url: `${base}/case-studies/${row.slug}`,
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
