import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getBlogPostBySlug, getBlogPostBySlugDraft } from '@/utilities/getBlogPosts'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = draft ? await getBlogPostBySlugDraft(slug) : await getBlogPostBySlug(slug)
  if (!post) notFound()
  if (!draft && post._status !== 'published') notFound()

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    url: `${base}/blog/${post.slug}`,
    type: 'article',
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    breadcrumbParent: { name: 'Blog', url: `${base}/blog` },
  })

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
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
  if (!post) return {}
  return generateMeta({ doc: post, pathSuffix: `/blog/${post.slug}`, type: 'article' })
}
