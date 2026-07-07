import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCaseStudyBySlug, getCaseStudyBySlugDraft } from '@/utilities/getCaseStudies'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { LivePreviewListener } from '@/app/components/LivePreviewListener'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const cs = draft ? await getCaseStudyBySlugDraft(slug) : await getCaseStudyBySlug(slug)
  if (!cs) notFound()
  if (!draft && cs._status !== 'published') notFound()

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: cs.meta?.title || cs.title,
    description: cs.meta?.description || cs.excerpt || undefined,
    url: `${base}/case-studies/${cs.slug}`,
    type: 'article',
    datePublished: cs.publishedAt || undefined,
    dateModified: cs.updatedAt || undefined,
    breadcrumbParent: { name: 'Case Studies', url: `${base}/case-studies` },
  })

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
      <h1 className="text-4xl font-bold mb-2">{cs.title}</h1>
      <p className="text-gray-500 mb-8">
        {cs.client}
        {cs.industry && ` · ${cs.industry}`}
        {cs.duration && ` · ${cs.duration}`}
      </p>
      {cs.services && cs.services.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {cs.services.map((s, i) => (
            <span key={i} className="px-3 py-1 text-sm bg-gray-100 rounded-full">
              {s.name}
            </span>
          ))}
        </div>
      )}
      <article className="prose">
        <RichText data={cs.content} />
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs) return {}
  return generateMeta({
    doc: cs,
    pathSuffix: `/case-studies/${cs.slug}`,
    type: 'article',
  } as Parameters<typeof generateMeta>[0])
}
