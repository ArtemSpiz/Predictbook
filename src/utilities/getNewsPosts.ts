import { cache } from 'react'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { News } from '@/payload-types'

interface FindArgs {
  page?: number
  limit?: number
  categorySlug?: string
  tagSlug?: string
  authorName?: string
}

async function fetchNewsPosts({ page = 1, limit = 10, categorySlug, tagSlug, authorName }: FindArgs) {
  const payload = await getPayload({ config })
  const where: Where = { _status: { equals: 'published' } }
  if (categorySlug) where['categories.slug'] = { equals: categorySlug }
  if (tagSlug) where['tags.slug'] = { equals: tagSlug }
  if (authorName) where['author.name'] = { equals: authorName }
  const result = await payload.find({
    collection: 'news',
    where,
    page,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return result as unknown as { docs: News[]; totalPages: number; totalDocs: number }
}

export const findNewsPosts = cache((args: FindArgs = {}) => {
  const { page = 1, limit = 10, categorySlug = '', tagSlug = '', authorName = '' } = args
  return unstable_cache(
    () => fetchNewsPosts({ page, limit, categorySlug, tagSlug, authorName }),
    ['news-posts', String(page), String(limit), categorySlug, tagSlug, authorName],
    { tags: ['payload'] },
  )()
})

async function fetchNewsPostBySlug(slug: string): Promise<News | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as News) ?? null
}

export const getNewsPostBySlug = cache((slug: string) =>
  unstable_cache(() => fetchNewsPostBySlug(slug), ['news-post', slug], { tags: ['payload'] })(),
)

/** Uncached draft fetch (includes unpublished) for live preview / draft mode. */
export async function getNewsPostBySlugDraft(slug: string): Promise<News | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as News) ?? null
}
