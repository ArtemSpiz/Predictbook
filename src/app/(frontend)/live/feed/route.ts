import { findLiveFeed } from '@/utilities/getLiveFeed'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { buildRss, liveToRssItem, rssResponse } from '@/utilities/rss'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const { docs } = await findLiveFeed({ limit: 50 })
  return rssResponse(
    buildRss({
      title: 'Predictbook — Live',
      description: 'Latest live threads from Predictbook.',
      link: `${base}/live`,
      feedUrl: `${base}/live/feed`,
      items: docs.map((f) => liveToRssItem(base, f)),
    }),
  )
}
