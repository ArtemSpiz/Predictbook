import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Time from '../../../../public/time.png'
import Image from 'next/image'
import FeedCard from '@/app/ui/FeedCard'
import { FeedContent } from '@/app/Mock/HomeMockData'
import Link from 'next/link'

export default function LiveFeedInfo() {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: 'Live Feed' }]} />
        <div className="font-semibold text-[#D7564F] flex items-center gap-1 text-2xl max-md:text-lg">
          <div className="w-2 h-2 rounded-full p-0.5  bg-[#D7564F3D] ">
            <div className="w-1 h-1 rounded-full bg-[#D7564F]" />
          </div>
          Live Feed
        </div>
        <div className="text-sm text-[#5D554F]">
          Real-time liveblog threads on trending prediction market topics — one carefully selected
          event per day.
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {FeedContent.map((card, i) => (
          <Link key={i} href={`/live-feed/${card.slug}`}>
            <FeedCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
