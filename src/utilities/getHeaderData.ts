import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Header } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

const EMPTY = { id: '', updatedAt: '', createdAt: '' } as unknown as Header

async function fetchHeaderData(): Promise<Header> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'header', depth: 1 })) as Header
  } catch {
    return EMPTY
  }
}

/** Cached `header` global (depth 1 populates logo/social media + link refs). */
export const getHeaderData = () =>
  unstable_cache(fetchHeaderData, ['header-global'], {
    tags: [cacheTags.all, cacheTags.global('header')],
  })()
