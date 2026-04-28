import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogByCategory({ params }: Props) {
  const { slug } = await params
  const { docs } = await findBlogPosts({ categorySlug: slug, limit: 50 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Category: {slug}</h1>
      <div className="space-y-6">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className="text-gray-600 mt-1">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}
