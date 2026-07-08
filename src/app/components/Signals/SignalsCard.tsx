import { SignalsCards } from '@/app/Mock/SignailsMock'
import Image from 'next/image'
import Star from '../../../../public/StarFeatured.png'

export default function SignalsCard() {
  const sortedCards = SignalsCards.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  return (
    <div className="flex flex-col gap-5">
      {sortedCards.map((card, i) => (
        <div
          key={i}
          className={`bg-white border border-[#E1DDD5] ${card.featured ? ' border-l-[#4A83EC] border-l ' : 'border-[#E1DDD5]'}`}
        >
          <div className="p-3 border-b flex max-md:flex-col max-md:items-start gap-3 items-center justify-between border-[#E1DDD5]">
            <div className="flex items-center gap-3 flex-wrap">
              {card.featured && (
                <div className="bg-[#E0E8F5] border-[#CAD7ED] text-[#4A83EC] px-1.5 py-1 flex items-center gap-2 text-xs uppercase">
                  <div className="w-3 h-3">
                    <Image src={Star} alt="" />
                  </div>
                  featured
                </div>
              )}

              {card.categories.map((item, index) => {
                const categoryStyle =
                  item.toLowerCase() === 'featured'
                    ? 'bg-[#E0E8F5] border-[#CAD7ED] text-[#4A83EC]'
                    : item.toLowerCase() === 'arbitrage'
                      ? 'bg-[#ECF2E0] border-[#C6DB9E] text-[#36581E]'
                      : item.toLowerCase() === 'crypto'
                        ? 'bg-[#FEFDF2] border-[#E9E9D1] text-[#655E4A]'
                        : item.toLowerCase() === 'whale alert'
                          ? 'bg-[#E8E0F2] border-[#ADABE7] text-[#3C3985]'
                          : item.toLowerCase() === 'politics'
                            ? 'bg-[#EBF5FF] border-[#C7DBEC] text-[#3B586F]'
                            : item.toLowerCase() === 'technology'
                              ? 'bg-[#FEF2F2] border-[#E9D1D1] text-[#654A4A]'
                              : item.toLowerCase() === 'sports'
                                ? 'bg-[#F2FEF3] border-[#D1E9D4] text-[#4A654F]'
                                : 'bg-[#F4F0ED] border-[#E1DDD5] text-[#5D554F]'

                return (
                  <div
                    key={index}
                    className={`px-1.5 py-1 flex items-center gap-2 text-xs uppercase ${categoryStyle}`}
                  >
                    {item}
                  </div>
                )
              })}
            </div>
            <div className="text-[#5D554F] text-xs flex-nowrap text-nowrap">
              {card.day} • {card.time} UTC
            </div>{' '}
          </div>

          <div className="flex gap-6 justify-between py-4 px-3">
            <div>
              <div className="text-base font-medium">{card.title}</div>
              <div className="text-sm text-[#5D554F] ">{card.subtitle}</div>
            </div>

            <div className="p-2 justify-center h-max flex flex-col items-center bg-[#F7F4F2] min-w-[78px] max-md:h-[78px]">
              <div className={`font-medium text-[#7E7873] text-sm font-mono uppercase`}>
                {card.profitably ? 'Yes' : 'No'}{' '}
              </div>
              <div className={`font-medium text-xl max-md:text-lg font-mono uppercase`}>
                {card.profitably ? card.YesPrice : card.NoPrice}{' '}
              </div>
              <div
                className={`font-medium text-[#7E7873] text-sm font-mono uppercase ${card.profitably ? 'text-[#357B46]' : 'text-[#B95757]'}`}
              >
                {card.profitablyPP}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 p-3 border-t border-[#E1DDD5]">
            <div className="flex flex-col gap-1">
              <div className="text-[#5D554F] uppercase font-mono font-medium text-xs">
                {card.featured ? 'Polymarket ' : 'YES PRICE'}
              </div>
              <div className="text-[#57B96F] uppercase font-mono font-medium text-lg">
                {card.YesPrice}
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l border-l-[#E1DDD5]">
              <div className="text-[#5D554F] uppercase font-mono font-medium text-xs">
                {card.featured ? 'KALSHI' : 'NO PRICE'}
              </div>
              <div className="text-[#B95757] uppercase font-mono font-medium text-lg">
                {card.NoPrice}
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l border-l-[#E1DDD5]">
              <div className="text-[#5D554F] uppercase font-mono font-medium text-xs">
                {card.featured ? 'SPREAD' : '24H VOLUME'}
              </div>
              <div
                className={`uppercase font-mono font-medium text-lg ${card.featured ? 'text-[#B98D57]' : ''}`}
              >
                {card.featured ? card.spread : card.volume}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
