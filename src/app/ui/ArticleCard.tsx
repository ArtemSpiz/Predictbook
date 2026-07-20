import { LiveBadge } from '@/app/ui/LiveBadge'
import { DevelopingBadge } from '@/app/ui/DevelopingBadge'
import { CategoryChips } from '@/app/ui/CategoryChips'
import { PayloadImage } from '@/app/components/PayloadImage'
import type { ArticleView } from '../lib/viewModels'

export default function ArticleCard({ card }: { card: ArticleView }) {
  return (
    <div
      className={`border cursor-pointer bg-white border-line border-solid transition-all duration-200 ease-in-out hover:bg-hover group flex flex-col h-full ${card.featured ? 'xl:col-span-2' : ''}`}
    >
      {card.featured && card.image && (
        <div className="relative h-auto w-full">
          <PayloadImage
            media={card.image}
            alt={card.title}
            className="w-full h-auto md:max-h-[290px] object-cover"
          />

          {(card.isDeveloping || card.live) && (
            <div className="absolute top-3.5 left-4 flex items-center gap-2">
              {card.isDeveloping && <DevelopingBadge className="bg-developing-bg" />}
              {card.live && <LiveBadge className="bg-live-soft" />}
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CategoryChips
              categories={card.categories}
              chipClassName="border border-solid p-1.5 text-sm uppercase max-md:text-xs"
            />
            {!card.image && card.isDeveloping && (
              <DevelopingBadge className="w-max bg-developing-bg" />
            )}
            {!card.image && card.live && <LiveBadge className="w-max bg-live-soft" />}
          </div>
          <div className="text-nowrap text-sm text-date">
            {card.day} · {card.time}
          </div>
        </div>

        <div>
          <div className="inline-block">
            <div className="text-base font-medium">{card.title}</div>
            <span className="block -mt-1 h-px w-full scale-x-0 bg-ink origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </div>
          <div className="line-clamp-3 text-sm text-muted">{card.text}</div>
        </div>
      </div>
    </div>
  )
}
