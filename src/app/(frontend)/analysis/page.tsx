import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getNewsPageContent } from '@/utilities/getPageContent'
import { resolvePageMeta } from '@/fields/seoMeta'
import NewsMain from '@/app/components/News/NewsMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNewsPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'news-list')
  const meta = resolvePageMeta(content?.meta, {
    title: block?.heading ?? 'Analysis',
    description: block?.subtitle ?? undefined,
  })
  return {
    ...meta,
    ...localeAlternates('analysis'),
    openGraph: { type: 'website', url: '/analysis', ...meta.openGraph },
  }
}

export default async function NewsList() {
  return (
    <main>
      <NewsMain />
    </main>
  )
}
