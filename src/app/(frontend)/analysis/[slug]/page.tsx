import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import {
  getNewsPostBySlug,
  getNewsPostBySlugDraft,
  findNewsPosts,
} from '@/utilities/getNewsPosts'
import { getCategoryBySlug } from '@/utilities/getCategories'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { LivePreviewListener } from '@/app/components/LivePreviewListener'
import NewsSlug from '@/app/components/News/NewsSlug'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar, getSocialLinks } from '@/utilities/getSiteSettings'
import { newsToArticleView } from '@/app/lib/viewModels'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { EmptyArticles } from '@/app/ui/EmptyArticles'
import { CategoryArticles } from '@/app/components/News/CategoryArticles'
import type { Category } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const CATEGORY_LIMIT = 30

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

async function CategoryListing({ category }: { category: Category }) {
  const [{ docs, totalDocs }, sidebar] = await Promise.all([
    findNewsPosts({ categorySlug: category.slug, limit: CATEGORY_LIMIT }),
    getSiteSidebar(),
  ])
  const articles = docs.map(newsToArticleView)

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
          <Breadcrumbs
            items={[{ label: 'Analysis', href: '/analysis' }, { label: category.title }]}
          />

          <BlockTitle title={category.title} />

          {articles.length === 0 ? (
            <EmptyArticles message="There are currently no articles in this category." />
          ) : (
            <CategoryArticles
              initial={articles}
              categorySlug={category.slug}
              limit={CATEGORY_LIMIT}
              totalDocs={totalDocs}
            />
          )}
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={sidebar.promoBlocks} />
        </div>
      </div>
    </main>
  )
}

// Unified resolver: the slug is a category listing when it matches a category,
// otherwise a news post. A post sharing a slug with a category is shadowed.
export default async function AnalysisSlugPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (category) return <CategoryListing category={category} />

  const { isEnabled: draft } = await draftMode()
  const post = draft ? await getNewsPostBySlugDraft(slug) : await getNewsPostBySlug(slug)
  if (!post) notFound()
  if (!draft && post._status !== 'published') notFound()

  const [related, sidebar, social] = await Promise.all([
    findNewsPosts({ limit: 6 }).then((r) => r.docs.map(newsToArticleView)),
    getSiteSidebar(),
    getSocialLinks(),
  ])

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    url: `${base}/analysis/${post.slug}`,
    type: 'article',
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    breadcrumbParent: { name: 'Analysis', url: `${base}/analysis` },
  })

  return (
    <main className="container-custom">
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <NewsSlug post={post} related={related} social={social} />
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
  const category = await getCategoryBySlug(slug)
  if (category) {
    return {
      title: `${category.title} — Analysis`,
      ...localeAlternates(`analysis/${slug}`),
    }
  }
  const post = await getNewsPostBySlug(slug)
  if (!post) return {}
  return generateMeta({
    doc: post,
    pathSuffix: `/analysis/${post.slug}`,
    type: 'article',
  } as Parameters<typeof generateMeta>[0])
}
