import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getLiveFeedPageContent } from '@/utilities/getPageContent'
import LiveFeedMain from '@/app/components/LiveFeed/LiveFeedMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLiveFeedPageContent()
  return {
    title: content?.title ?? 'Live Feed',
    description: content?.subtitle ?? undefined,
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
