import Image from 'next/image'
import CustomBtn from '@/app/ui/CustomBtn'
import Timeline from '../../../public/timeline.png'
import { LiveBadge } from '@/app/ui/LiveBadge'
import { CategoryChips } from '@/app/ui/CategoryChips'
import type { FeedView } from '../lib/viewModels'

interface FeedCardProps {
  card: FeedView
  home?: boolean
}

export default function FeedCard({ card, home = false }: FeedCardProps) {
  return (
    <div className="bg-white border border-line">
      <div
        className={`border-b gap-2  border-line flex justify-between max-md:flex-col-reverse p-4 ${home ? 'bg-white' : card.live ? 'bg-live-soft-2' : 'bg-gray-soft'}`}
      >
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-medium text-base">{card.title}</div>
            {!home && card.subtitle && (
              <div className="text-muted text-sm">{card.subtitle}</div>
            )}
          </div>

          {!home && card.categories.length > 0 && (
            <CategoryChips
              categories={card.categories}
              className="flex gap-1 items-center"
              chipClassName="border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs"
            />
          )}
        </div>

        {!home &&
          (card.live ? (
            <LiveBadge className="flex gap-2 w-max h-max items-center bg-live-a20 px-1.5 py-1 text-xs font-medium uppercase text-danger" />
          ) : (
            <div className="px-1.5 py-1 text-sm font-medium uppercase text-gray-strong">Closed</div>
          ))}
      </div>

      <div className="p-4">
        {card.timeline.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div
              className={`text-sm ${item.time.toLowerCase() === 'latest' ? 'text-live' : 'text-muted'}`}
            >
              {item.time}
            </div>

            <div className="w-3 h-auto">
              <Image src={Timeline} alt="" />
            </div>

            <div className="flex-1 pb-6 text-sm text-muted">{item.text}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between p-4">
        <div className="flex items-center text-xs font-medium uppercase text-muted">
          {card.updates} updates
        </div>

        <div className="w-max">
          <CustomBtn text="Read full thread" light />
        </div>
      </div>
    </div>
  )
}
