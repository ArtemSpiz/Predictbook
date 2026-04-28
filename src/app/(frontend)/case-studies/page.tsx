import Link from 'next/link'
import { findCaseStudies } from '@/utilities/getCaseStudies'

export default async function CaseStudiesList() {
  const { docs } = await findCaseStudies()
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {docs.map((cs) => {
          const cover = typeof cs.coverImage === 'object' ? cs.coverImage : null
          return (
            <article key={cs.id} className="border rounded-lg overflow-hidden">
              {cover?.url && (
                <img src={cover.url} alt="" className="w-full h-48 object-cover" />
              )}
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

export const metadata = { title: 'Case Studies' }
