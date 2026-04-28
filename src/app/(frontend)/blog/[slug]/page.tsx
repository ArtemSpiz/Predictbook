import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getBlogPostBySlug } from '@/utilities/getBlogPosts'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || post._status !== 'published') notFound()
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.publishedAt && (
        <p className="text-sm text-gray-500 mb-8">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}
      <article className="prose">
        <RichText data={post.content} />
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {}
}
