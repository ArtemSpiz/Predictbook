import type { Metadata } from 'next'
import Link from 'next/link'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { localeAlternates } from '@/utilities/metadataAlternates'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `#${slug} — Analysis`,
    description: `Articles tagged "${slug}".`,
    ...localeAlternates(`news/tag/${slug}`),
  }
}

export default async function NewsByTag({ params }: Props) {
  const { slug } = await params
  const { docs } = await findNewsPosts({ tagSlug: slug, limit: 50 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Tag: {slug}</h1>
      <div className="space-y-6">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-xl font-semibold">
              <Link href={`/news/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className="text-gray-600 mt-1">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}
