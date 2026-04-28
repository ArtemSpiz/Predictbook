import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCaseStudyBySlug } from '@/utilities/getCaseStudies'

type Props = { params: Promise<{ slug: string }> }

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs || cs._status !== 'published') notFound()
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
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
  return cs ? { title: cs.title, description: cs.excerpt ?? undefined } : {}
}
