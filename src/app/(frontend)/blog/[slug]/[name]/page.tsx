import RealCard from '@/app/components/Home/RealCard'
import { ArticlesContent } from '@/app/Mock/BlogMockData'
import ArticleCard from '@/app/ui/ArticleCard'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Image from 'next/image'
import Link from 'next/link'
import Arrow from '../../../../../../public/down.png'
import Notification from '@/../public/Notification.png'
import Rss from '@/../public/Rss.png'
import X from '@/../public/XBlog.png'

type Props = {
  params: Promise<{
    slug: string
    name: string
  }>
}

const Content = [
  {
    icon: Notification,
    text: 'Get Alerts',
    link: '',
  },
  {
    icon: Rss,
    text: 'RSS Feed',
    link: '',
  },
  {
    icon: X,
    link: '',
  },
]

export default async function AuthorPage({ params }: Props) {
  const { name } = await params

  const author = decodeURIComponent(name).replace(/-/g, ' ')

  const articles = ArticlesContent.filter((article) => article.name === author)

  const authorInfo = articles[0]

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
          <Breadcrumbs items={[{ label: 'Analysis', href: '/blog' }, { label: author }]} />

          <div className="flex justify-between gap-3 lg:items-center max-lg:flex-col">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 lg:min-h-28 lg:min-w-28 min-w-20 max-lg:w-20 max-lg:h-20 rounded-full overflow-hidden">
                <Image src={authorInfo.authorPhoto} alt="" className="object-cover w-full h-full" />
              </div>

              <BlockTitle title={author} subtitle={authorInfo.authorJob} />
            </div>

            <div className="flex items-center lg:justify-end flex-wrap gap-1">
              {Content.map((item, i) => (
                <div
                  key={i}
                  className="border text-sm flex-nowrap border-[#E1DDD5] rounded-md p-2 flex items-center gap-2"
                >
                  <div className="w-4 h-4">
                    <Image src={item.icon} alt="" />
                  </div>

                  <div className="text-nowrap">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {articles.length === 0 ? (
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
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
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
                />
              ))}

              {articles.length >= 10 && (
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
