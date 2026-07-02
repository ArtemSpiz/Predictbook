import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { CollectionSlug } from 'payload'

export type SitemapRow = { slug: string; updatedAt: string | null }

async function fetchPublishedRows(collection: CollectionSlug): Promise<SitemapRow[]> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      select: { slug: true, updatedAt: true },
    })
    return docs
      .map((doc) => {
        const d = doc as Record<string, unknown>
        return {
          slug: typeof d.slug === 'string' ? d.slug : '',
          updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : null,
        }
      })
      .filter((r) => r.slug)
  } catch {
    return []
  }
}

/** Cached published slug + updatedAt rows for a collection (sitemap `lastmod`). */
export const getPublishedSitemapRows = (collection: CollectionSlug) =>
  unstable_cache(() => fetchPublishedRows(collection), ['sitemap-rows', collection], {
    tags: ['payload'],
  })()
