import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Category } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return (result.docs[0] as unknown as Category) ?? null
}

// Categories collection has no revalidate hooks; this tag is flushed via cacheTags.all.
export const getCategoryBySlug = cache((slug: string) =>
  unstable_cache(() => fetchCategoryBySlug(slug), ['category', slug], {
    tags: [cacheTags.all, cacheTags.collection('categories')],
  })(),
)
