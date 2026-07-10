import AllBtn from '@/app/ui/AllBtn'
import FeedCard from '@/app/ui/FeedCard'
import Link from 'next/link'
import type { FeedView } from '@/app/lib/viewModels'
import { PulseDot } from '@/app/ui/PulseDot'

interface FeedProps {
  heading: string
  viewAllText: string
  viewAllUrl: string
  items: FeedView[]
}

export default function Feed({ heading, viewAllText, viewAllUrl, items }: FeedProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-1">
          <PulseDot variant="live" />
          <div className="text-live text-2xl font-extrabold max-md:text-lg">{heading}</div>
        </div>

        <AllBtn text={viewAllText} link={viewAllUrl} />
      </div>

      <div className="flex flex-col gap-6">
        {items.map((card) => (
          <Link key={card.slug} href={`/live-feed/${card.slug}`}>
            <FeedCard card={card} home />
          </Link>
        ))}
      </div>
    </div>
  )
}
