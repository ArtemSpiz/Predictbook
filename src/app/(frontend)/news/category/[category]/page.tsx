import type { Metadata } from 'next'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { EmptyArticles } from '@/app/ui/EmptyArticles'
import { CategoryArticles } from '@/app/components/News/CategoryArticles'
import { localeAlternates } from '@/utilities/metadataAlternates'

type Props = {
  params: Promise<{ category: string }>
}

const CATEGORY_LIMIT = 30

function label(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  return {
    title: `${label(category)} — Analysis`,
    ...localeAlternates(`news/category/${category}`),
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const [{ docs, totalDocs }, sidebar] = await Promise.all([
    findNewsPosts({ categorySlug: category, limit: CATEGORY_LIMIT }),
    getSiteSidebar(),
  ])
  const articles = docs.map(newsToArticleView)
  const formattedCategoryLabel = label(category)

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
          <Breadcrumbs
            items={[{ label: 'Analysis', href: '/news' }, { label: formattedCategoryLabel }]}
          />

          <BlockTitle title={formattedCategoryLabel} />

          {articles.length === 0 ? (
            <EmptyArticles message="There are currently no articles in this category." />
          ) : (
            <CategoryArticles
              initial={articles}
              categorySlug={category}
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
