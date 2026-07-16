import { LiveBadge } from '@/app/ui/LiveBadge'
import { CategoryChips } from '@/app/ui/CategoryChips'
import { PayloadImage } from '@/app/components/PayloadImage'
import type { ArticleView } from '../lib/viewModels'

export default function ArticleCard({ card }: { card: ArticleView }) {
  return (
    <div
      className={`border cursor-pointer bg-white border-line border-solid transition-all duration-200 ease-in-out hover:bg-hover group ${card.featured ? 'xl:col-span-2' : ''}`}
    >
      {card.featured && card.image && (
        <div className="relative h-auto w-full">
          <PayloadImage
            media={card.image}
            alt={card.title}
            className="w-full h-auto md:max-h-[290px]"
          />

          {card.live && (
            <div className="absolute top-3.5 left-4 flex items-center gap-2">
              <LiveBadge className="bg-live-soft" />
            </div>
          )}
        </div>
      )}

      <div className={`border-b border-line ${card.featured ? 'px-4 py-2' : 'p-4'}`}>
        {card.live && !card.image && <LiveBadge className="w-max mb-2 bg-live-soft" />}
        <div className="inline-block mb-1 ">
          <div className="text-base font-medium">{card.title}</div>
          <span className="block -mt-1 h-px w-full scale-x-0 bg-ink origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </div>
        <div className="line-clamp-3 text-sm text-muted">{card.text}</div>
      </div>

      <div
        className={`"flex items-center justify-between max-md:flex-row-reverse ${card.featured ? 'px-4 py-2' : 'p-4'}`}
      >
        <div className="text-nowrap text-sm text-date">
          {card.day} · {card.time}
        </div>

        <CategoryChips
          categories={card.categories}
          chipClassName="border border-solid p-1.5 text-sm uppercase max-md:text-xs"
        />
      </div>
    </div>
  )
}
