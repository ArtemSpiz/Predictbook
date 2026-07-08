import Image from 'next/image'
import CustomBtn from '@/app/ui/CustomBtn'
import Timeline from '../../../public/timeline.png'
import { getCategoryStyle } from '../lib/getCategoryStyle'
import Live from '../../../public/live.png'
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_CREATE_ROOT_CONTAINERS } from 'react-dom/client'

interface FeedCardProps {
  card: {
    live?: boolean
    title: string
    subtitle?: string
    categories?: Array<string>
    updates: number
    timeline: {
      time: string
      text: string
    }[]
  }
  home?: boolean
}

export default function FeedCard({ card, home = false }: FeedCardProps) {
  return (
    <div className="bg-white border border-[#E1DDD5]">
      <div
        className={`border-b gap-2  border-[#E1DDD5] flex justify-between max-md:flex-col-reverse p-4 ${home ? 'bg-white' : card.live ? 'bg-[#F9E6E5]' : 'bg-[#F1F1F1]'}`}
      >
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-medium text-base">{card.title}</div>
            {!home && card.subtitle && (
              <div className="text-[#5D554F] text-sm">{card.subtitle}</div>
            )}
          </div>

          {!home && card.categories && (
            <div className="flex gap-1 items-center">
              {card.categories.map((item) => (
                <div
                  key={item}
                  className={`border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs ${getCategoryStyle(item)}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {!home &&
          (card.live ? (
            <div className="flex gap-2 w-max h-max items-center bg-[#D7564F33] px-1.5 py-1 text-xs font-medium uppercase text-[#CF372F]">
              <Image src={Live} alt="" className="w-4 h-4" />
              LIVE
            </div>
          ) : (
            <div className="px-1.5 py-1 text-sm font-medium uppercase text-[#5E5E5E]">Closed</div>
          ))}
      </div>

      <div className="p-4">
        {card.timeline.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div
              className={`text-sm ${item.time.toLowerCase() === 'latest' ? 'text-[#D7564F]' : 'text-[#5D554F]'}`}
            >
              {item.time}
            </div>

            <div className="w-3 h-auto">
              <Image src={Timeline} alt="" />
            </div>

            <div className="flex-1 pb-6 text-sm text-[#5D554F]">{item.text}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between p-4">
        <div className="flex items-center text-xs font-medium uppercase text-[#5D554F]">
          {card.updates} updates
        </div>

        <div className="w-max">
          <CustomBtn text="Read full thread" light />
        </div>
      </div>
    </div>
  )
}
