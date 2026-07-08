import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArticlesContent } from '@/app/Mock/BlogMockData'
import RealCard from '@/app/components/Home/RealCard'
import ArticleCard from '@/app/ui/ArticleCard'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Arrow from '../../../../../../public/down.png'

type Props = { 
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  const filteredArticles = ArticlesContent.filter((article) =>
    article.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
  )

  const categoryLabel =
    filteredArticles[0]?.categories.find((c) => c.toLowerCase() === category.toLowerCase()) ??
    category

  const formattedCategoryLabel = categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
          <Breadcrumbs
            items={[{ label: 'Analysis', href: '/blog' }, { label: formattedCategoryLabel }]}
          />

          <BlockTitle title={formattedCategoryLabel} />

          {filteredArticles.length === 0 ? (
            <div className=" border-t border-b border-[#E1DDD5] py-20 text-center">
              <h2 className="text-2xl font-semibold">No articles found</h2>
              <p className="mt-2 text-[#6B7280]">
                There are currently no articles in this category.
              </p>

              <Link
                href="/blog"
                className="bg-[#221E1D] border-none text-[#F7F4F2] py-3 px-4 rounded-lg text-base mt-3 inline-flex"
              >
                Back to all articles
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredArticles.map((article, index) => (
                <Link  key={article.slug}  href={`/blog/${article.slug}`} >
                <ArticleCard
                  card={{
                    title: article.title,
                    text: article.text,
                    image: article.image,
                    underTitle: article.underTitle,
                    live: article.live,
                    day: article.day,
                    time: article.time,
                    categories: article.categories,
                    featured: index === 0,
                  }}
                /></Link>
              ))}

              {filteredArticles.length >= 10 && (
                <button
                  className={`bg-[#E8DFD8] justify-center group w-max mx-auto border-none flex items-center gap-2 px-3 py-2.5 rounded-lg`}
                >
                  <span>Load more</span>
                  <Image src={Arrow} alt="Arrow" className="w-4 h-4 relative " />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
        </div>
      </div>
    </main>
  )
}
