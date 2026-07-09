import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getLiveFeedPageContent } from '@/utilities/getPageContent'
import LiveFeedMain from '@/app/components/LiveFeed/LiveFeedMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLiveFeedPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'live-feed-list')
  return {
    title: block?.heading ?? 'Live Feed',
    description: block?.subtitle ?? undefined,
    ...localeAlternates('live-feed'),
  }
}

export default async function LiveFeedPageRoute() {
  return (
    <main>
      <LiveFeedMain />
    </main>
  )
}
