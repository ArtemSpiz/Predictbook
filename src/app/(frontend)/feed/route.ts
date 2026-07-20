import { findNewsPosts } from '@/utilities/getNewsPosts'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { buildRss, newsToRssItem, liveToRssItem, rssResponse } from '@/utilities/rss'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const [{ docs: news }, { docs: live }] = await Promise.all([
    findNewsPosts({ limit: 50 }),
    findLiveFeed({ limit: 50 }),
  ])
  const items = [
    ...news.map((p) => newsToRssItem(base, p)),
    ...live.map((f) => liveToRssItem(base, f)),
  ]
    .sort((a, b) => new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime())
    .slice(0, 50)

  return rssResponse(
    buildRss({
      title: 'Predictbook',
      description: 'Latest analysis and live coverage from Predictbook.',
      link: base,
      feedUrl: `${base}/feed`,
      items,
    }),
  )
}
