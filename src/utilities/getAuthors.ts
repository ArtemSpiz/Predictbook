import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Author } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

async function fetchAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'authors',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    return (docs[0] as unknown as Author) ?? null
  } catch {
    return null
  }
}

export const getAuthorBySlug = cache((slug: string) =>
  unstable_cache(() => fetchAuthorBySlug(slug), ['author', slug], {
    tags: [cacheTags.all, cacheTags.collection('authors')],
  })(),
)

async function fetchAllAuthors(): Promise<Author[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'authors',
      limit: 200,
      depth: 1,
      sort: 'name',
      overrideAccess: true,
    })
    return docs as unknown as Author[]
  } catch {
    return []
  }
}

export const getAllAuthors = cache(() =>
  unstable_cache(fetchAllAuthors, ['authors-all'], {
    tags: [cacheTags.all, cacheTags.collection('authors')],
  })(),
)
