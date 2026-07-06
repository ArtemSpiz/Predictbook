import Image from 'next/image'
import gridImg from '../../../../public/gridImg.png'
import BtnArrow from '../../../../public/BtnArrow.png'
import AllBtn from '@/app/ui/AllBtn'

const ArticlesContent = [
  {
    underTitle: 'DEVELOPING',
    image: gridImg,
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['AI', 'REGULATION'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
]

export default async function GridArticles() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3">
        <div>
          <div className="font-semibold text-2xl max-md:text-lg">Analysis</div>
          <div className="text-sm text-[#5D554F]">Expert perspectives behind market movements.</div>
        </div>
        <AllBtn text="All articles" />
      </div>

      <div className="xl:grid-cols-2 grid gap-2">
        {ArticlesContent.map((card, i) => (
          <div
            key={i}
            className={` border border-[#E1DDD5] border-solid 
              ${i === 0 && 'xl:col-span-2 '}
             `}
          >
            {card?.image && (
              <div className="w-full h-auto relative">
                <Image src={card?.image} alt="" />

                <div className="bg-[#F7F4F2] py-1 px-1.5 text-[#6B42D9] uppercase font-bold text-xs absolute top-3.5 left-4">
                  {card.underTitle}
                </div>
              </div>
            )}

            <div className="p-4 border-b border-[#E1DDD5]">
              <div className="font-medium text-base mb-1">{card.title}</div>
              <div className="text-sm text-[#5D554F] line-clamp-3">{card.text}</div>
            </div>

            <div className="p-4 flex items-center justify-between max-md:flex-row-reverse">
              <div className="text-sm text-[#7D7169] text-nowrap">
                {card.day} · {card.time}
              </div>

              <div className="flex items-center gap-1">
                {card.categories.map((category) => (
                  <div
                    key={category}
                    className="border border-[#E1DDD5] border-solid bg-[#F4F0ED] p-1.5 text-[#5D554F] uppercase text-sm max-md:text-xs"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
