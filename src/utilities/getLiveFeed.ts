import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { LiveFeed } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

interface FindArgs {
  page?: number
  limit?: number
}

async function fetchLiveFeed({ page = 1, limit = 10 }: FindArgs) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'live-feed',
    where: { _status: { equals: 'published' } },
    page,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return result as unknown as { docs: LiveFeed[]; totalPages: number; totalDocs: number }
}

export const findLiveFeed = cache((args: FindArgs = {}) => {
  const { page = 1, limit = 10 } = args
  return unstable_cache(
    () => fetchLiveFeed({ page, limit }),
    ['live-feed', String(page), String(limit)],
    { tags: [cacheTags.all, cacheTags.collection('live-feed')] },
  )()
})

async function fetchLiveFeedBySlug(slug: string): Promise<LiveFeed | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'live-feed',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as LiveFeed) ?? null
}

export const getLiveFeedBySlug = cache((slug: string) =>
  unstable_cache(() => fetchLiveFeedBySlug(slug), ['live-feed-item', slug], {
    tags: [cacheTags.all, cacheTags.collection('live-feed'), cacheTags.docSlug('live-feed', slug)],
  })(),
)
