import Image from 'next/image'
import Live from '../../../../public/live.png'

import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { getCategoryStyle } from '@/app/lib/getCategoryStyle'
import { FeedArticle } from '@/app/Mock/HomeMockData'
import Timeline from '../../../../public/timeline.png'

interface Props {
  article: FeedArticle
}

export default function LiveFeedSlug({ article }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
      <Breadcrumbs items={[{ label: 'Live Feed', href: '/live-feed' }, { label: article.title }]} />
      <div className="flex items-center gap-2">
        {article.live && (
          <div className="flex h-[-webkit-fill-available] gap-2 items-center bg-[#F7DDDC] px-1.5 py-1 text-xs font-medium uppercase text-[#CF372F]">
            <Image src={Live} alt="" className="w-4 h-4" />
            LIVE
          </div>
        )}

        {article.categories.map((category) => {
          return (
            <div
              key={category}
              className={`border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs ${getCategoryStyle(category)}`}
            >
              {category}
            </div>
          )
        })}
      </div>

      <div>
        <div className="text-2xl font-bold mb-1">{article.title}</div>
        <div className="text-[#5D554F] text-sm">{article.subtitle}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[#5D554F] text-sm">
          Started {article.day} • {article.time}
        </div>
      </div>
      <div className="w-full h-px bg-[#E1DDD5]" />

      <div className="p-4 bg-white">
        {/* багато richText*/}
        {article.timeline.map((item, index) => (
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
    </div>
  )
}
