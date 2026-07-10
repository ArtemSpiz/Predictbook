import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import ArticleCard from '@/app/ui/ArticleCard'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { localeAlternates } from '@/utilities/metadataAlternates'
import Arrow from '../../../../../../public/down.png'

type Props = {
  params: Promise<{ category: string }>
}

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
  const { docs } = await findNewsPosts({ categorySlug: category, limit: 30 })
  const articles = docs.map(newsToArticleView)
  const formattedCategoryLabel = label(category)
  const sidebar = await getSiteSidebar()

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
          <Breadcrumbs
            items={[{ label: 'Analysis', href: '/news' }, { label: formattedCategoryLabel }]}
          />

          <BlockTitle title={formattedCategoryLabel} />

          {articles.length === 0 ? (
            <div className=" border-t border-b border-line py-20 text-center">
              <h2 className="text-2xl font-semibold">No articles found</h2>
              <p className="mt-2 text-gray-text">
                There are currently no articles in this category.
              </p>

              <Link
                href="/news"
                className="bg-ink border-none text-paper py-3 px-4 rounded-lg text-base mt-3 inline-flex"
              >
                Back to all articles
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {articles.map((article, index) => (
                <Link key={article.slug} href={`/news/${article.slug}`}>
                  <ArticleCard card={{ ...article, featured: index === 0 }} />
                </Link>
              ))}

              {articles.length >= 10 && (
                <button
                  className={`bg-sand justify-center group w-max mx-auto border-none flex items-center gap-2 px-3 py-2.5 rounded-lg`}
                >
                  <span>Load more</span>
                  <Image src={Arrow} alt="Arrow" className="w-4 h-4 relative " />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={sidebar.promoBlocks} />
        </div>
      </div>
    </main>
  )
}
