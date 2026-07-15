import { notFound } from 'next/navigation'
import { getLiveFeedBySlug } from '@/utilities/getLiveFeed'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import LiveFeedSlug from '@/app/components/LiveFeed/LiveFeedSlug'
import RealCard from '@/app/components/Home/RealCard'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
export function generateStaticParams() {
  return []
}

export default async function LiveFeedThread({ params }: Props) {
  const { slug } = await params
  const item = await getLiveFeedBySlug(slug)
  if (!item) notFound()
  if (item._status !== 'published') notFound()

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: item.meta?.title || item.title,
    description: item.meta?.description || item.subtitle || undefined,
    url: `${base}/live/${item.slug}`,
    type: 'article',
    datePublished: item.publishedAt || undefined,
    dateModified: item.updatedAt || undefined,
    breadcrumbParent: { name: 'Live Feed', url: `${base}/live` },
  })

  return (
    <main className="container-custom">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <LiveFeedSlug item={item} />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = await getLiveFeedBySlug(slug)
  if (!item) return {}
  return generateMeta({
    doc: { ...item, excerpt: item.subtitle },
    pathSuffix: `/live/${item.slug}`,
    type: 'article',
  } as Parameters<typeof generateMeta>[0])
}
