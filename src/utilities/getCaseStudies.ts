import { getPayload } from 'payload'
import config from '@payload-config'
import type { CaseStudy } from '@/payload-types'

export async function findCaseStudies({
  industry,
  service,
}: { industry?: string; service?: string } = {}) {
  const payload = await getPayload({ config })
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
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

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return ((result.docs[0] as unknown) as CaseStudy) ?? null
}
