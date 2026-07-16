import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { CollectionSlug, Where } from 'payload'
import { cacheTags } from '@/utilities/cacheTags'

export type SitemapRow = { slug: string; updatedAt: string | null }

// Categories/Tags have no draft/publish workflow, so filtering by _status
// would return nothing — those collections pass requirePublished: false.
const publishedWhere = (requirePublished: boolean): Where | undefined =>
  requirePublished ? { _status: { equals: 'published' } } : undefined

async function fetchRows(
  collection: CollectionSlug,
  page: number,
  limit: number,
  requirePublished: boolean,
): Promise<SitemapRow[]> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      where: publishedWhere(requirePublished),
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

async function fetchCount(collection: CollectionSlug, requirePublished: boolean): Promise<number> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection,
      where: publishedWhere(requirePublished),
      overrideAccess: true,
    })
    return totalDocs
  } catch {
    return 0
  }
}

/** Cached slug + updatedAt rows for one page of a collection. */
export const getSitemapRows = (
  collection: CollectionSlug,
  { page = 1, limit = 1000, requirePublished = true }: {
    page?: number
    limit?: number
    requirePublished?: boolean
  } = {},
) =>
  unstable_cache(
    () => fetchRows(collection, page, limit, requirePublished),
    ['sitemap-rows', collection, String(page), String(limit), String(requirePublished)],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()

async function fetchAllRows(
  collection: CollectionSlug,
  pageSize: number,
  max: number,
  requirePublished: boolean,
): Promise<SitemapRow[]> {
  const all: SitemapRow[] = []
  for (let page = 1; all.length < max; page++) {
    const rows = await fetchRows(collection, page, pageSize, requirePublished)
    all.push(...rows)
    if (rows.length < pageSize) break
  }
  return all.slice(0, max)
}

/** Cached ALL rows for a collection (paginated internally, capped at `max`,
 * which stays under the 50k-URL sitemap limit). */
export const getAllSitemapRows = (
  collection: CollectionSlug,
  { pageSize = 1000, max = 45000, requirePublished = true }: {
    pageSize?: number
    max?: number
    requirePublished?: boolean
  } = {},
) =>
  unstable_cache(
    () => fetchAllRows(collection, pageSize, max, requirePublished),
    ['sitemap-rows-all', collection, String(pageSize), String(max), String(requirePublished)],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()

/** Cached count of docs in a collection (for shard planning). */
export const getSitemapCount = (collection: CollectionSlug, requirePublished = true) =>
  unstable_cache(
    () => fetchCount(collection, requirePublished),
    ['sitemap-count', collection, String(requirePublished)],
    { tags: [cacheTags.all, cacheTags.collection(collection)] },
  )()
