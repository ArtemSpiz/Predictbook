import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { cacheTags } from '@/utilities/cacheTags'

// Collections whose docs are embedded across many pages (media) can't be
// scoped cheaply — flush everything for those instead.
const COARSE_COLLECTIONS = new Set(['media'])

export function collectionRevalidationTags(slug: string, doc?: { slug?: unknown }): string[] {
  if (COARSE_COLLECTIONS.has(slug)) return [cacheTags.all]
  const tags = [cacheTags.collection(slug)]
  if (doc && typeof doc.slug === 'string' && doc.slug) {
    tags.push(cacheTags.docSlug(slug, doc.slug))
  }
  return tags
}

export function globalRevalidationTags(name: string): string[] {
  return [cacheTags.global(name)]
}

async function flush(tags: string[]): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tags) revalidateTag(tag)
  } catch {
    /* not running inside Next.js (e.g. the Payload CLI) */
  }
}

/** Flush the coarse `payload` tag directly (used by the manual webhook path). */
export async function revalidateFrontCache(): Promise<void> {
  await flush([cacheTags.all])
}

/** Spread into a collection's `hooks` to revalidate scoped tags on write. */
export const revalidateCollectionHooks: {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} = {
  afterChange: [
    ({ collection, doc }) => {
      void flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
  afterDelete: [
    ({ collection, doc }) => {
      void flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
}

/** Spread into a global's `hooks` to revalidate its scoped tag on save. */
export const revalidateGlobalHooks: { afterChange: GlobalAfterChangeHook[] } = {
  afterChange: [
    ({ global, doc }) => {
      void flush(globalRevalidationTags(global.slug))
      return doc
    },
  ],
}
