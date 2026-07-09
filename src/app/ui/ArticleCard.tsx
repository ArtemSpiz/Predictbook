import Image from 'next/image'
import Live from '../../../public/live.png'
import { getCategoryStyle } from '../lib/getCategoryStyle'
import { PayloadImage } from '@/app/components/PayloadImage'
import type { ArticleView } from '../lib/viewModels'

export default function ArticleCard({ card }: { card: ArticleView }) {
  return (
    <div
      className={`border cursor-pointer bg-white border-line border-solid transition-all duration-200 ease-in-out hover:bg-hover group ${card.featured ? 'xl:col-span-2' : ''}`}
    >
      {card.featured && card.image && (
        <div className="relative h-auto w-full">
          <PayloadImage media={card.image} alt={card.title} className="w-full h-auto" />

          {card.live && (
            <div className="absolute top-3.5 left-4 flex items-center gap-2">
              <div className="flex gap-2 items-center bg-live-soft px-1.5 py-1 text-xs font-medium uppercase text-danger">
                <Image src={Live} alt="" className="w-4 h-4" />
                LIVE
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-b border-line p-4">
        {card.live && !card.image && (
          <div className="flex gap-2 w-max mb-2 items-center bg-live-soft px-1.5 py-1 text-xs font-medium uppercase text-danger">
            <Image src={Live} alt="" className="w-4 h-4" />
            LIVE
          </div>
        )}
        <div className="inline-block mb-1 ">
          <div className="text-base font-medium">{card.title}</div>
          <span className="block -mt-1 h-px w-full scale-x-0 bg-ink origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </div>
        <div className="line-clamp-3 text-sm text-muted">{card.text}</div>
      </div>

      <div className="flex items-center justify-between p-4 max-md:flex-row-reverse">
        <div className="text-nowrap text-sm text-date">
          {card.day} · {card.time}
        </div>

        <div className="flex items-center gap-1">
          {card.categories.map((category) => (
            <div
              key={category}
              className={`border border-solid p-1.5 text-sm uppercase max-md:text-xs ${getCategoryStyle(category)}`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
