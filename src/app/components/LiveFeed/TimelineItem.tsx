import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PayloadImage } from '@/app/components/PayloadImage'
import { RelativeTime } from '@/app/ui/RelativeTime'
import Timeline from '../../../../public/timeline.png'
import type { TimelineEntry } from '@/app/lib/viewModels'

export function TimelineItem({ entry, compact = false }: { entry: TimelineEntry; compact?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-start">
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
        {entry.heading && (
          <div className={`mb-1 font-medium ${compact ? 'text-sm' : 'text-base'}`}>
            {entry.heading}
          </div>
        )}
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
  )
}
