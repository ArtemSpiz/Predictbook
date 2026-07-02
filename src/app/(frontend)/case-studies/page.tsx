import type { Metadata } from 'next'
import Link from 'next/link'
import { findCaseStudies } from '@/utilities/getCaseStudies'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { PayloadImage } from '@/components/PayloadImage'

export default async function CaseStudiesList() {
  const { docs } = await findCaseStudies()
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {docs.map((cs) => {
          return (
            <article key={cs.id} className="border rounded-lg overflow-hidden">
              <PayloadImage
                media={cs.coverImage}
                className="w-full h-48 object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/case-studies/${cs.slug}`}>{cs.title}</Link>
                </h2>
                <p className="text-sm text-gray-500">
                  {cs.client}
                  {cs.industry && ` · ${cs.industry}`}
                </p>
                {cs.excerpt && <p className="mt-2 text-gray-600">{cs.excerpt}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Case Studies',
  ...localeAlternates('/case-studies'),
  openGraph: { type: 'website', title: 'Case Studies', url: '/case-studies' },
}
