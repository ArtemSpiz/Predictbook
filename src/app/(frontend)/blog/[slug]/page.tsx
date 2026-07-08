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
import RealCard from '@/app/components/Home/RealCard'
import SponsoredCard from '@/app/components/Home/SponsoredCard'

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
    <main className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <BlogSlug article={article} />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
          <SponsoredCard />
        </div>
      </div>
    </main>
  )
}

// export async function generateMetadata({ params }: Props) {
//   const { slug } = await params
//   const post = await getBlogPostBySlug(slug)
//   if (!post) return {}
//   return generateMeta({
//     doc: post,
//     pathSuffix: `/blog/${post.slug}`,
//     type: 'article',
//   } as Parameters<typeof generateMeta>[0])
// }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  const article = ArticlesContent.find((item) => item.slug === slug)

  if (!article) return {}

  return {
    title: article.title,
    description: article.text,
  }
}
