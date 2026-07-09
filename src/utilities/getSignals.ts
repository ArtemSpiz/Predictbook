import { cache } from 'react'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Signal } from '@/payload-types'

interface FindArgs {
  page?: number
  limit?: number
  kind?: Signal['kind']
  featured?: boolean
}

async function fetchSignals({ page = 1, limit = 10, kind, featured }: FindArgs) {
  const payload = await getPayload({ config })
  const where: Where = { _status: { equals: 'published' } }
  if (kind) where.kind = { equals: kind }
  if (featured) where.featured = { equals: true }
  const result = await payload.find({
    collection: 'signals',
    where,
    page,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return result as unknown as { docs: Signal[]; totalPages: number; totalDocs: number }
}

export const findSignals = cache((args: FindArgs = {}) => {
  const { page = 1, limit = 10, kind = '', featured = false } = args
  return unstable_cache(
    () => fetchSignals({ page, limit, kind: (kind || undefined) as Signal['kind'], featured }),
    ['signals', String(page), String(limit), String(kind), String(featured)],
    { tags: ['payload'] },
  )()
})

async function fetchSignalBySlug(slug: string): Promise<Signal | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'signals',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as Signal) ?? null
}

export const getSignalBySlug = cache((slug: string) =>
  unstable_cache(() => fetchSignalBySlug(slug), ['signal', slug], { tags: ['payload'] })(),
)
