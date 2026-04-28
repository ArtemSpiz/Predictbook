import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Page } from '@/payload-types'

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

export const getPageBySlug = (slug: string) =>
  unstable_cache(() => fetchPageBySlug(slug), ['page', slug], {
    tags: [`page:${slug}`],
    revalidate: 60,
  })()
