import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { CollectionSlug } from 'payload'
import { cacheTags } from '@/utilities/cacheTags'

export type SitemapRow = { slug: string; updatedAt: string | null }

async function fetchPublishedRows(
  collection: CollectionSlug,
  page: number,
  limit: number,
): Promise<SitemapRow[]> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      page,
      limit,
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

async function fetchPublishedCount(collection: CollectionSlug): Promise<number> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection,
      where: { _status: { equals: 'published' } },
      overrideAccess: true,
    })
    return totalDocs
  } catch {
    return 0
  }
}

/** Cached published slug + updatedAt rows for one page of a collection. */
export const getPublishedSitemapRows = (
  collection: CollectionSlug,
  { page = 1, limit = 1000 }: { page?: number; limit?: number } = {},
) =>
  unstable_cache(
    () => fetchPublishedRows(collection, page, limit),
    ['sitemap-rows', collection, String(page), String(limit)],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()

async function fetchAllPublishedRows(
  collection: CollectionSlug,
  pageSize: number,
  max: number,
): Promise<SitemapRow[]> {
  const all: SitemapRow[] = []
  for (let page = 1; all.length < max; page++) {
    const rows = await fetchPublishedRows(collection, page, pageSize)
    all.push(...rows)
    if (rows.length < pageSize) break
  }
  return all.slice(0, max)
}

/** Cached ALL published rows for a collection (paginated internally, capped at
 * the sitemap URL limit). For the core sitemap shard where the set is unsharded. */
export const getAllPublishedSitemapRows = (
  collection: CollectionSlug,
  { pageSize = 1000, max = 45000 }: { pageSize?: number; max?: number } = {},
) =>
  unstable_cache(
    () => fetchAllPublishedRows(collection, pageSize, max),
    ['sitemap-rows-all', collection, String(pageSize), String(max)],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()

/** Cached count of published docs in a collection (for shard planning). */
export const getPublishedSitemapCount = (collection: CollectionSlug) =>
  unstable_cache(
    () => fetchPublishedCount(collection),
    ['sitemap-count', collection],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()
