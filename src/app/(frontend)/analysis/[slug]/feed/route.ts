import { findNewsPosts } from '@/utilities/getNewsPosts'
import { getCategoryBySlug } from '@/utilities/getCategories'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { buildRss, newsToRssItem, rssResponse } from '@/utilities/rss'

export const revalidate = 3600

// Per-category analysis feed. The [slug] here is a category slug; a post slug
// (or unknown slug) has no feed and 404s.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return new Response('Not found', { status: 404 })

  const base = getSiteUrl()
  const { docs } = await findNewsPosts({ categorySlug: category.slug, limit: 50 })
  return rssResponse(
    buildRss({
      title: `Predictbook — ${category.title}`,
      description: `Latest ${category.title} analysis from Predictbook.`,
      link: `${base}/analysis/${category.slug}`,
      feedUrl: `${base}/analysis/${category.slug}/feed`,
      items: docs.map((p) => newsToRssItem(base, p)),
    }),
  )
}
