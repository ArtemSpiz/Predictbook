import Feed from '@/app/components/Home/Feed'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { liveFeedToView } from '@/app/lib/viewModels'

type LiveFeedBlockProps = {
  heading: string
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function LiveFeedBlockComponent({ block }: { block: LiveFeedBlockProps }) {
  const res = await findLiveFeed({ limit: 1 })
  const items = res.docs.map(liveFeedToView)
  return (
    <Feed
      heading={block.heading}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? '/live'}
      items={items}
      timelineLimit={block.limit ?? 3}
    />
  )
}
