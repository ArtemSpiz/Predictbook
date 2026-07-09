import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import FeedCard from '@/app/ui/FeedCard'
import Link from 'next/link'
import type { FeedView } from '@/app/lib/viewModels'
import type { LiveFeedPage } from '@/payload-types'

interface Props {
  items: FeedView[]
  content?: LiveFeedPage | null
}

export default function LiveFeedInfo({ items, content }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: content?.title ?? 'Live Feed' }]} />
        <div className="font-semibold text-live flex items-center gap-1 text-2xl max-md:text-lg">
          <div className="w-2 h-2 rounded-full p-0.5  bg-live-a24 ">
            <div className="w-1 h-1 rounded-full bg-live" />
          </div>
          {content?.title ?? 'Live Feed'}
        </div>
        <div className="text-sm text-muted">
          {content?.subtitle ??
            'Real-time liveblog threads on trending prediction market topics — one carefully selected event per day.'}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {items.map((card) => (
          <Link key={card.slug} href={`/live-feed/${card.slug}`}>
            <FeedCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
