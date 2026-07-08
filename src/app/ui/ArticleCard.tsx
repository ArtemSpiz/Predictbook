import Image, { StaticImageData } from 'next/image'
import Live from '../../../public/live.png'
import { getCategoryStyle } from '../lib/getCategoryStyle'

interface ArticleCardProps {
  card: {
    underTitle?: string
    image?: string | StaticImageData
    live?: boolean
    title: string
    text: string
    day: string
    time: string
    categories: string[]
    featured?: boolean
  }
}

export default function ArticleCard({ card }: ArticleCardProps) {
  return (
    <div
      className={`border cursor-pointer bg-white border-[#E1DDD5] border-solid transition-all duration-200 ease-in-out hover:bg-[#FAF8F7] group ${card.featured ? 'xl:col-span-2' : ''}`}
    >
      {card.featured && card.image && (
        <div className="relative h-auto w-full">
          <Image src={card.image} alt={card.title} />

          {card.underTitle && (
            <div className="absolute top-3.5 left-4 flex items-center gap-2">
              <div className=" bg-[#F7F4F2] px-1.5 py-1 text-xs font-bold uppercase text-[#6B42D9]">
                {card.underTitle}
              </div>

              {card.live && (
                <div className="flex gap-2 items-center bg-[#F7DDDC] px-1.5 py-1 text-xs font-medium uppercase text-[#CF372F]">
                  <Image src={Live} alt="" className="w-4 h-4" />
                  LIVE
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="border-b border-[#E1DDD5] p-4">
        {card.live && !card.image && (
          <div className="flex gap-2 w-max mb-2 items-center bg-[#F7DDDC] px-1.5 py-1 text-xs font-medium uppercase text-[#CF372F]">
            <Image src={Live} alt="" className="w-4 h-4" />
            LIVE
          </div>
        )}
        <div className="inline-block mb-1 ">
          <div className="text-base font-medium">{card.title}</div>
          <span className="block -mt-1 h-px w-full scale-x-0 bg-[#221E1D] origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </div>
        <div className="line-clamp-3 text-sm text-[#5D554F]">{card.text}</div>
      </div>

      <div className="flex items-center justify-between p-4 max-md:flex-row-reverse">
        <div className="text-nowrap text-sm text-[#7D7169]">
          {card.day} · {card.time}
        </div>

        <div className="flex items-center gap-1">
          {card.categories.map((category) => {
            return (
              <div
                key={category}
                className={`border border-solid p-1.5 text-sm uppercase max-md:text-xs ${getCategoryStyle(category)}`}
              >
                {category}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
