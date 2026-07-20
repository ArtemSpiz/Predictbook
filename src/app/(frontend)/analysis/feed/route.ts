import { findNewsPosts } from '@/utilities/getNewsPosts'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { buildRss, newsToRssItem, rssResponse } from '@/utilities/rss'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const { docs } = await findNewsPosts({ limit: 50 })
  return rssResponse(
    buildRss({
      title: 'Predictbook — Analysis',
      description: 'Latest analysis from Predictbook.',
      link: `${base}/analysis`,
      feedUrl: `${base}/analysis/feed`,
      items: docs.map((p) => newsToRssItem(base, p)),
    }),
  )
}
