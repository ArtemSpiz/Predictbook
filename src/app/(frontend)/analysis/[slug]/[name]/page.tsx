import type { Metadata } from 'next'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { ArticleList } from '@/app/ui/ArticleList'
import { EmptyArticles } from '@/app/ui/EmptyArticles'
import Image from 'next/image'
import Notification from '@/../public/Notification.png'
import Rss from '@/../public/Rss.png'
import X from '@/../public/XNews.png'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'
import { localeAlternates } from '@/utilities/metadataAlternates'

type Props = {
  params: Promise<{ slug: string; name: string }>
}

const Content = [
  { icon: Notification, text: 'Get Alerts' },
  { icon: Rss, text: 'RSS Feed' },
  { icon: X, text: '' },
]

function authorFromParam(name: string) {
  return decodeURIComponent(name).replace(/-/g, ' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const author = authorFromParam(name)
  return { title: author, ...localeAlternates(`analysis`) }
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params
  const author = authorFromParam(name)

  const [{ docs }, sidebar] = await Promise.all([
    findNewsPosts({ authorName: author, limit: 100 }),
    getSiteSidebar(),
  ])

  const articles = docs.map(newsToArticleView)

  const firstPost = docs[0]
  const authorPhoto =
    firstPost?.['author photo'] && typeof firstPost['author photo'] === 'object'
      ? firstPost['author photo']
      : null
  const authorJob = firstPost?.['author job'] ?? ''

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
          <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: author }]} />

          <div className="flex justify-between gap-3 lg:items-center max-lg:flex-col">
            <div className="flex items-center gap-4">
              {authorPhoto?.url && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={authorPhoto.url}
                    alt={authorPhoto.alt || author}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <BlockTitle title={author} subtitle={authorJob} />
            </div>

            <div className="flex items-center lg:justify-end flex-wrap gap-1">
              {Content.map((item, i) => (
                <div
                  key={i}
                  className="border text-sm flex-nowrap border-line rounded-md p-2 flex items-center gap-2"
                >
                  <div className="w-4 h-4">
                    <Image src={item.icon} alt="" />
                  </div>

                  {item.text && <div className="text-nowrap">{item.text}</div>}
                </div>
              ))}
            </div>
          </div>

          {articles.length === 0 ? (
            <EmptyArticles message="There are currently no articles by this author." />
          ) : (
            <ArticleList articles={articles} />
          )}
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={sidebar.promoBlocks} />
        </div>
      </div>
    </main>
  )
}
