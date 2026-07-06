import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Invalidate the shared `payload` cache tag. All front-end data utilities are
 * cached with `tags: ['payload']`, so a single tag flush refreshes the site
 * after any content change. Wrapped in try/catch + dynamic import so it is a
 * no-op outside the Next.js runtime (e.g. the Payload CLI).
 */
export async function revalidateFrontCache(): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag('payload')
  } catch {
    /* not running inside Next.js */
  }
}

/** Spread into a collection's `hooks` to revalidate on any create/update/delete. */
export const revalidateCollectionHooks: {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} = {
  afterChange: [
    ({ doc }) => {
      void revalidateFrontCache()
      return doc
    },
  ],
  afterDelete: [
    ({ doc }) => {
      void revalidateFrontCache()
      return doc
    },
  ],
}

/** Spread into a global's `hooks` to revalidate on save. */
export const revalidateGlobalHooks: { afterChange: GlobalAfterChangeHook[] } = {
  afterChange: [
    ({ doc }) => {
      void revalidateFrontCache()
      return doc
    },
  ],
}
