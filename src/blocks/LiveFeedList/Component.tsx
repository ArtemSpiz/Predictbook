import LiveFeedInfo from '@/app/components/LiveFeed/LiveFeedInfo'
import FeedCard from '@/app/ui/FeedCard'
import Link from 'next/link'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { liveFeedToView } from '@/app/lib/viewModels'

type LiveFeedListBlockProps = {
  heading: string
  subtitle?: string | null
  limit?: number | null
}

export async function LiveFeedListBlockComponent({ block }: { block: LiveFeedListBlockProps }) {
  const res = await findLiveFeed({ limit: block.limit ?? 20 })
  const items = res.docs.map(liveFeedToView)

  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <LiveFeedInfo title={block.heading} subtitle={block.subtitle} />

      <div className="flex flex-col gap-5">
        {items.map((card) => (
          <Link key={card.slug} href={`/live/${card.slug}`}>
            <FeedCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
