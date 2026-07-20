import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAuthorBySlug } from '@/utilities/getAuthors'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'
import { getSiteSidebar } from '@/utilities/getSiteSettings'
import { ArticleList } from '@/app/ui/ArticleList'
import { EmptyArticles } from '@/app/ui/EmptyArticles'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import BlockTitle from '@/app/ui/BlockTitle'
import { PayloadImage } from '@/app/components/PayloadImage'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { localeAlternates } from '@/utilities/metadataAlternates'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
export function generateStaticParams() {
  return []
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const [{ docs }, sidebar] = await Promise.all([
    findNewsPosts({ authorProfileId: author.id, limit: 100 }),
    getSiteSidebar(),
  ])
  const articles = docs.map(newsToArticleView)

  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-lg:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-6 flex-1 lg:border-r border-line lg:p-5">
          <Breadcrumbs items={[{ label: author.name }]} />

          <div className="flex justify-between gap-3 lg:items-center max-lg:flex-col">
            <div className="flex items-center gap-4">
              {author.photo && (
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <PayloadImage
                    media={author.photo}
                    alt={author.name}
                    className="w-16 h-16 object-cover"
                  />
                </div>
              )}
              <BlockTitle title={author.name} subtitle={author.role ?? undefined} />
            </div>

            {author.social && author.social.length > 0 && (
              <div className="flex items-center lg:justify-end flex-wrap gap-1">
                {author.social.map((item, i) => {
                  // Icons are usually SVG uploads, which next/image can't optimize
                  // without dangerouslyAllowSVG — render them directly.
                  const iconUrl =
                    typeof item.icon === 'object' && item.icon ? item.icon.url : item.icon
                  return (
                    <a
                      key={i}
                      href={item.url ?? undefined}
                      target={item.url ? '_blank' : undefined}
                      rel={item.url ? 'noopener noreferrer' : undefined}
                      className="border cursor-pointer text-sm flex-nowrap border-line rounded-md px-2 flex items-center gap-2 min-w-8 min-h-8"
                    >
                      {iconUrl && (
                        <img
                          src={iconUrl}
                          alt={item.text ?? ''}
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      {item.text && <div className="text-nowrap">{item.text}</div>}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {author.bio && <p className="text-muted text-sm max-w-2xl">{author.bio}</p>}

          {articles.length === 0 ? (
            <EmptyArticles message="There are currently no articles by this author." />
          ) : (
            <ArticleList articles={articles} />
          )}
        </div>
        <div className="flex flex-col gap-4 lg:max-w-[300px]">
          <RenderBlockList blocks={sidebar.promoBlocks} />
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: author.name,
    description: author.bio ?? undefined,
    ...localeAlternates(`author/${slug}`),
  }
}
