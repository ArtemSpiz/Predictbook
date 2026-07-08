import AllBtn from '@/app/ui/AllBtn'
import CustomBtn from '@/app/ui/CustomBtn'
import Timeline from '../../../../public/timeline.png'
import Image from 'next/image'
import FeedCard from '@/app/ui/FeedCard'
import { FeedContent } from '@/app/Mock/HomeMockData'
import Link from 'next/link'

export default async function Feed() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5  bg-[#D7564F3D] ">
            <div className="w-1 h-1 rounded-full bg-[#D7564F]" />
          </div>
          <div className="text-[#D7564F] text-2xl font-extrabold max-md:text-lg">Live Feed</div>
        </div>

        <AllBtn text="All threads" link="/live-feed" />
      </div>

      <div className="flex flex-col gap-6">
        {FeedContent.slice(0, 1).map((card, i) => (
          <Link key={i} href={`/live-feed/${card.slug}`} >
            <FeedCard card={card} home />
          </Link>
        ))}
      </div>
    </div>
  )
}
