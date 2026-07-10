import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Page } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as unknown as Page) ?? null
}

/**
 * Cached page fetch. `unstable_cache` persists across requests (invalidated by
 * scoped collection/doc tags on matching edits, or by the coarse `payload`
 * fallback); React `cache` dedupes calls within a single request/render.
 */
export const getPageBySlug = cache((slug: string) =>
  unstable_cache(() => fetchPageBySlug(slug), ['page', slug], {
    tags: [cacheTags.all, cacheTags.collection('pages'), cacheTags.docSlug('pages', slug)],
  })(),
)

/** Uncached draft fetch (includes unpublished) for live preview / draft mode. */
export async function getPageBySlugDraft(slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft: true,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as Page) ?? null
}
