import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LiveBadge } from '@/app/ui/LiveBadge'
import { CategoryChip } from '@/app/ui/CategoryChips'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { PayloadImage } from '@/app/components/PayloadImage'
import { RelativeTime } from '@/app/ui/RelativeTime'
import { PreferredSourceButton } from '@/app/ui/PreferredSourceButton'
import { Byline } from '@/app/components/LiveFeed/Byline'
import { sortByNewest } from '@/utilities/timeline'
import { categoryNames, fmtDay, fmtTime } from '@/app/lib/viewModels'
import Timeline from '../../../../public/timeline.png'
import type { LiveFeed } from '@/payload-types'

export default function LiveFeedSlug({ item }: { item: LiveFeed }) {
  const categories = categoryNames(item.categories)
  const timeline = sortByNewest(item.timeline ?? [])
  return (
    <div className="flex flex-col gap-6 flex-1 lg:border-r border-line lg:p-5">
      <Breadcrumbs items={[{ label: 'Live Feed', href: '/live' }, { label: item.title }]} />
      <div className="flex items-center gap-2">
        {item.status === 'closed' ? (
          <div className="px-1.5 py-1 text-sm font-medium uppercase text-gray-strong">Closed</div>
        ) : (
          <LiveBadge className="h-[-webkit-fill-available] bg-live-soft" />
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

      <Byline authors={item.authors} editor={item.lastEditedBy} />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PreferredSourceButton />
      </div>

      {item.coverImage && (
        <PayloadImage media={item.coverImage} alt={item.title} className="w-full rounded-xl" />
      )}

      <div className="w-full h-px bg-line" />

      <div className="p-4 bg-white">
        {timeline.map((entry, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-start">
            <div
              className={`md:w-32 shrink-0 text-sm ${entry.time.toLowerCase() === 'latest' ? 'text-live' : 'text-muted'}`}
            >
              {entry.time}
              <RelativeTime iso={entry.at} className="block text-xs text-muted" />
            </div>

            <div className="w-3 h-auto shrink-0">
              <Image src={Timeline} alt="" />
            </div>

            <div className="flex-1 pb-6">
              {entry.heading && <div className="mb-1 text-base font-medium">{entry.heading}</div>}
              {entry.image && (
                <PayloadImage
                  media={entry.image}
                  alt={entry.heading ?? ''}
                  className="mb-2 w-full rounded-lg"
                />
              )}
              <div className="prose max-w-none text-sm text-muted [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                <RichText data={entry.body} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
