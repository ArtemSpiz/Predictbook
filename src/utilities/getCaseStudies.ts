import { cache } from 'react'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { CaseStudy } from '@/payload-types'

async function fetchCaseStudies({ industry, service }: { industry?: string; service?: string }) {
  const payload = await getPayload({ config })
  const where: Where = { _status: { equals: 'published' } }
  if (industry) where.industry = { equals: industry }
  if (service) where['services.name'] = { equals: service }
  const result = await payload.find({
    collection: 'case-studies',
    where,
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
  })
  return result as unknown as { docs: CaseStudy[]; totalDocs: number }
}

export const findCaseStudies = cache((args: { industry?: string; service?: string } = {}) => {
  const { industry = '', service = '' } = args
  return unstable_cache(
    () => fetchCaseStudies({ industry, service }),
    ['case-studies', industry, service],
    { tags: ['payload'] },
  )()
})

async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as CaseStudy) ?? null
}

export const getCaseStudyBySlug = cache((slug: string) =>
  unstable_cache(() => fetchCaseStudyBySlug(slug), ['case-study', slug], { tags: ['payload'] })(),
)

/** Uncached draft fetch (includes unpublished) for live preview / draft mode. */
export async function getCaseStudyBySlugDraft(slug: string): Promise<CaseStudy | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as CaseStudy) ?? null
}
