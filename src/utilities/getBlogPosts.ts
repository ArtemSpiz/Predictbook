import { getPayload } from 'payload'
import config from '@payload-config'
import type { Blog } from '@/payload-types'

interface FindArgs {
  page?: number
  limit?: number
  categorySlug?: string
  tagSlug?: string
}

export async function findBlogPosts({
  page = 1,
  limit = 10,
  categorySlug,
  tagSlug,
}: FindArgs = {}) {
  const payload = await getPayload({ config })
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
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

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return ((result.docs[0] as unknown) as Blog) ?? null
}
