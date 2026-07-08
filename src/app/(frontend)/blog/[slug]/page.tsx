import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getBlogPostBySlug, getBlogPostBySlugDraft } from '@/utilities/getBlogPosts'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { LivePreviewListener } from '@/app/components/LivePreviewListener'
import BlogSlug from '@/app/components/Blog/BlogSlug'
import { ArticlesContent } from '@/app/Mock/BlogMockData'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  // const post = draft ? await getBlogPostBySlugDraft(slug) : await getBlogPostBySlug(slug)
  // if (!post) notFound()
  // if (!draft && post._status !== 'published') notFound()

  // const base = getSiteUrl()
  // const structuredData = generatePageStructuredData({
  //   title: post.meta?.title || post.title,
  //   description: post.meta?.description || post.excerpt || undefined,
  //   url: `${base}/blog/${post.slug}`,
  //   type: 'article',
  //   datePublished: post.publishedAt || undefined,
  //   dateModified: post.updatedAt || undefined,
  //   breadcrumbParent: { name: 'Blog', url: `${base}/blog` },
  // })

  const article = ArticlesContent.find((item) => item.slug === slug)
  if (!article) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <BlogSlug article={article} />
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return generateMeta({
    doc: post,
    pathSuffix: `/blog/${post.slug}`,
    type: 'article',
  } as Parameters<typeof generateMeta>[0])
}
