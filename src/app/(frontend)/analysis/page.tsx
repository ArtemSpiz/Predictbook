import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getNewsPageContent } from '@/utilities/getPageContent'
import NewsMain from '@/app/components/News/NewsMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNewsPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'news-list')
  const title = block?.heading ?? 'Analysis'
  return {
    title,
    description: block?.subtitle ?? undefined,
    ...localeAlternates('analysis'),
    openGraph: { type: 'website', title, url: '/analysis' },
  }
}

export default async function NewsList() {
  return (
    <main>
      <NewsMain />
    </main>
  )
}
