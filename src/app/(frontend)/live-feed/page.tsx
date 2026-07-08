import type { Metadata } from 'next'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { localeAlternates } from '@/utilities/metadataAlternates'
import LiveFeedMain from '@/app/components/LiveFeed/LiveFeedMain'

export const metadata: Metadata = { ...localeAlternates('') }

export default async function Signals() {
  const page = await getPageBySlug('live-feed')
  if (!page) {
    return (
      <div>
        <LiveFeedMain />
      </div>
    )
  }
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}
