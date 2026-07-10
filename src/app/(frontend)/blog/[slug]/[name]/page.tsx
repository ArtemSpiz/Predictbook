import type { Metadata } from 'next'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import ArticleCard from '@/app/ui/ArticleCard'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Image from 'next/image'
import Link from 'next/link'
import Notification from '@/../public/Notification.png'
import Rss from '@/../public/Rss.png'
import X from '@/../public/XBlog.png'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView } from '@/app/lib/viewModels'
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
  return { title: author, ...localeAlternates(`blog`) }
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params
  const author = authorFromParam(name)

  const { docs } = await findBlogPosts({ limit: 100 })
  const articles = docs
    .filter((post) => {
      const a = post.author && typeof post.author === 'object' ? post.author : null
      return a?.name?.toLowerCase() === author.toLowerCase()
    })
    .map(blogToArticleView)
  const sidebar = await getSiteSidebar()

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
          <Breadcrumbs items={[{ label: 'Analysis', href: '/blog' }, { label: author }]} />

          <div className="flex justify-between gap-3 lg:items-center max-lg:flex-col">
            <BlockTitle title={author} />

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
            <div className=" border-t border-b border-line py-20 text-center">
              <h2 className="text-2xl font-semibold">No articles found</h2>
              <p className="mt-2 text-gray-text">There are currently no articles by this author.</p>

              <Link
                href="/blog"
                className="bg-ink border-none text-paper py-3 px-4 rounded-lg text-base mt-3 inline-flex"
              >
                Back to all articles
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {articles.map((article, index) => (
                <Link key={article.slug} href={`/blog/${article.slug}`}>
                  <ArticleCard card={{ ...article, featured: index === 0 }} />
                </Link>
              ))}
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
