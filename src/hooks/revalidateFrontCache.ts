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
    // Awaited so revalidateTag runs within the write request's context; a
    // fire-and-forget flush races request teardown and intermittently drops the
    // invalidation, leaving pages on their stale ISR cache until the timer.
    async ({ collection, doc }) => {
      // Payload's generic hook doc type has no `slug`; the runtime typeof guard below makes this safe.
      await flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
  afterDelete: [
    async ({ collection, doc }) => {
      await flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
}

/** Spread into a global's `hooks` to revalidate its scoped tag on save. */
export const revalidateGlobalHooks: { afterChange: GlobalAfterChangeHook[] } = {
  afterChange: [
    async ({ global, doc }) => {
      await flush(globalRevalidationTags(global.slug))
      return doc
    },
  ],
}
