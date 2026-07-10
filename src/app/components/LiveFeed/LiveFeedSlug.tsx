import Image from 'next/image'
import { LiveBadge } from '@/app/ui/LiveBadge'
import { CategoryChip } from '@/app/ui/CategoryChips'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { categoryNames, fmtDay, fmtTime } from '@/app/lib/viewModels'
import Timeline from '../../../../public/timeline.png'
import type { LiveFeed } from '@/payload-types'

export default function LiveFeedSlug({ item }: { item: LiveFeed }) {
  const categories = categoryNames(item.categories)
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <Breadcrumbs items={[{ label: 'Live Feed', href: '/live-feed' }, { label: item.title }]} />
      <div className="flex items-center gap-2">
        {item.live && (
          <LiveBadge className="flex h-[-webkit-fill-available] gap-2 items-center bg-live-soft px-1.5 py-1 text-xs font-medium uppercase text-danger" />
        )}

        {categories.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            className="border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs"
          />
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-1">{item.title}</h1>
        <div className="text-muted text-sm">{item.subtitle}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted text-sm">
          Started {fmtDay(item.publishedAt)} • {fmtTime(item.publishedAt)}
        </div>
      </div>
      <div className="w-full h-px bg-line" />

      <div className="p-4 bg-white">
        {(item.timeline ?? []).map((entry, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div
              className={`text-sm ${entry.time.toLowerCase() === 'latest' ? 'text-live' : 'text-muted'}`}
            >
              {entry.time}
            </div>

            <div className="w-3 h-auto">
              <Image src={Timeline} alt="" />
            </div>

            <div className="flex-1 pb-6 text-sm text-muted">{entry.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
