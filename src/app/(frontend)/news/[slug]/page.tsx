import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import {
  getNewsPostBySlug,
  getNewsPostBySlugDraft,
  findNewsPosts,
} from '@/utilities/getNewsPosts'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { LivePreviewListener } from '@/app/components/LivePreviewListener'
import NewsSlug from '@/app/components/News/NewsSlug'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import { newsToArticleView } from '@/app/lib/viewModels'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

export default async function NewsPost({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = draft ? await getNewsPostBySlugDraft(slug) : await getNewsPostBySlug(slug)
  if (!post) notFound()
  if (!draft && post._status !== 'published') notFound()

  const related = (await findNewsPosts({ limit: 6 })).docs.map(newsToArticleView)
  const sidebar = await getSiteSidebar()

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    url: `${base}/news/${post.slug}`,
    type: 'article',
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    breadcrumbParent: { name: 'News', url: `${base}/news` },
  })

  return (
    <main className="container-custom">
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <NewsSlug post={post} related={related} />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={sidebar.promoBlocks} />
          <RenderBlockList blocks={sidebar.sponsoredBlocks} />
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) return {}
  return generateMeta({
    doc: post,
    pathSuffix: `/news/${post.slug}`,
    type: 'article',
  } as Parameters<typeof generateMeta>[0])
}
