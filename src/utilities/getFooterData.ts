import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Footer } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

const EMPTY = { id: '', updatedAt: '', createdAt: '' } as unknown as Footer

async function fetchFooterData(): Promise<Footer> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'footer', depth: 1 })) as Footer
  } catch {
    return EMPTY
  }
}

/** Cached `footer` global (depth 1 populates social media + link refs). */
export const getFooterData = () =>
  unstable_cache(fetchFooterData, ['footer-global'], {
    tags: [cacheTags.all, cacheTags.global('footer')],
  })()
