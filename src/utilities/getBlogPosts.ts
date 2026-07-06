import { cache } from 'react'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Blog } from '@/payload-types'

interface FindArgs {
  page?: number
  limit?: number
  categorySlug?: string
  tagSlug?: string
}

async function fetchBlogPosts({ page = 1, limit = 10, categorySlug, tagSlug }: FindArgs) {
  const payload = await getPayload({ config })
  const where: Where = { _status: { equals: 'published' } }
  if (categorySlug) where['categories.slug'] = { equals: categorySlug }
  if (tagSlug) where['tags.slug'] = { equals: tagSlug }
  const result = await payload.find({
    collection: 'blog',
    where,
    page,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return result as unknown as { docs: Blog[]; totalPages: number; totalDocs: number }
}

export const findBlogPosts = cache((args: FindArgs = {}) => {
  const { page = 1, limit = 10, categorySlug = '', tagSlug = '' } = args
  return unstable_cache(
    () => fetchBlogPosts({ page, limit, categorySlug, tagSlug }),
    ['blog-posts', String(page), String(limit), categorySlug, tagSlug],
    { tags: ['payload'] },
  )()
})

async function fetchBlogPostBySlug(slug: string): Promise<Blog | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as Blog) ?? null
}

export const getBlogPostBySlug = cache((slug: string) =>
  unstable_cache(() => fetchBlogPostBySlug(slug), ['blog-post', slug], { tags: ['payload'] })(),
)

/** Uncached draft fetch (includes unpublished) for live preview / draft mode. */
export async function getBlogPostBySlugDraft(slug: string): Promise<Blog | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as Blog) ?? null
}
