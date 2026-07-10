import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getPublishedSitemapCount } from '@/utilities/sitemapData'
import { sitemapShardIds } from '@/utilities/sitemapShards'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const settings = await getSiteSettings()
  const newsCount = settings.sitemapIncludeNews ? await getPublishedSitemapCount('news') : 0
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    sitemapShardIds(newsCount)
      .map(({ id }) => `<sitemap><loc>${base}/sitemap/${id}.xml</loc></sitemap>`)
      .join('') +
    `</sitemapindex>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
