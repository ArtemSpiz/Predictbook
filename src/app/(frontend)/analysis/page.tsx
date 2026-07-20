import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getNewsPageContent } from '@/utilities/getPageContent'
import { resolvePageMeta } from '@/utilities/resolvePageMeta'
import NewsMain from '@/app/components/News/NewsMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNewsPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'news-list')
  return {
    ...(await resolvePageMeta(content?.meta, {
      title: block?.heading ?? 'Analysis',
      description: block?.subtitle ?? undefined,
      url: '/analysis',
    })),
    ...localeAlternates('analysis', '/analysis/feed'),
  }
}

export default async function NewsList() {
  return (
    <main>
      <NewsMain />
    </main>
  )
}
