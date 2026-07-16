import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getLiveFeedPageContent } from '@/utilities/getPageContent'
import { resolvePageMeta } from '@/fields/seoMeta'
import LiveFeedMain from '@/app/components/LiveFeed/LiveFeedMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLiveFeedPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'live-feed-list')
  return {
    ...resolvePageMeta(content?.meta, {
      title: block?.heading ?? 'Live Feed',
      description: block?.subtitle ?? undefined,
    }),
    ...localeAlternates('live'),
  }
}

export default async function LiveFeedPageRoute() {
  return (
    <main>
      <LiveFeedMain />
    </main>
  )
}
