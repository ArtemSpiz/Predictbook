import type { Metadata } from 'next'
import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { localeAlternates } from '@/utilities/metadataAlternates'

export default async function BlogList() {
  const { docs } = await findBlogPosts({ limit: 20 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Blog',
  ...localeAlternates('/blog'),
  openGraph: { type: 'website', title: 'Blog', url: '/blog' },
}
