import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllAuthors } from '@/utilities/getAuthors'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import BlockTitle from '@/app/ui/BlockTitle'
import { EmptyArticles } from '@/app/ui/EmptyArticles'
import { PayloadImage } from '@/app/components/PayloadImage'
import { localeAlternates } from '@/utilities/metadataAlternates'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Team',
  description: 'The people behind Predictbook.',
  ...localeAlternates('team'),
}

export default async function TeamPage() {
  const authors = await getAllAuthors()

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex flex-col gap-6 max-lg:p-0 max-lg:py-5">
        <Breadcrumbs items={[{ label: 'Team' }]} />
        <BlockTitle title="Our team" subtitle="The people behind Predictbook." />

        {authors.length === 0 ? (
          <EmptyArticles message="The team will be introduced here soon." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.slug}`}
                className="border border-line rounded-lg p-4 flex flex-col items-center text-center gap-3 hover:bg-shell transition-colors"
              >
                {author.photo && (
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <PayloadImage media={author.photo} alt={author.name} className="w-20 h-20 object-cover" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{author.name}</div>
                  {author.role && <div className="text-muted text-sm">{author.role}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
