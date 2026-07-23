import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import CustomBtn from '@/app/ui/CustomBtn'
import Timeline from '../../../public/timeline.png'
import { LiveBadge } from '@/app/ui/LiveBadge'
import { CategoryChips } from '@/app/ui/CategoryChips'
import { PayloadImage } from '@/app/components/PayloadImage'
import { RelativeTime } from '@/app/ui/RelativeTime'
import type { FeedView } from '../lib/viewModels'

interface FeedCardProps {
  card: FeedView
  home?: boolean
  timelineLimit?: number
}

export default function FeedCard({ card, home = false, timelineLimit }: FeedCardProps) {
  const timeline = timelineLimit ? card.timeline.slice(0, timelineLimit) : card.timeline
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
            <LiveBadge className="w-max h-max bg-live-a20" />
          ) : (
            <div className="px-1.5 py-1 text-sm font-medium uppercase text-gray-strong">Closed</div>
          ))}
      </div>

      <div className="p-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div
              className={`shrink-0 text-sm ${item.time.toLowerCase() === 'latest' ? 'text-live' : 'text-muted'}`}
            >
              {item.time}
              <RelativeTime iso={item.at} className="block text-xs text-muted" />
            </div>

            <div className="w-3 h-auto shrink-0">
              <Image src={Timeline} alt="" />
            </div>

            <div className="flex-1 pb-6">
              {item.heading && <div className="mb-1 text-sm font-medium">{item.heading}</div>}
              {item.image && (
                <PayloadImage
                  media={item.image}
                  alt={item.heading ?? ''}
                  className="mb-2 w-full rounded-lg"
                />
              )}
              <div className="prose max-w-none text-sm text-muted [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                <RichText data={item.body} />
              </div>
            </div>
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
