import Image from 'next/image'
import Star from '../../../../public/StarFeatured.png'
import { getCategoryStyle } from '@/app/lib/getCategoryStyle'
import type { SignalView } from '@/app/lib/viewModels'

export default function SignalsCard({ cards }: { cards: SignalView[] }) {
  const sortedCards = [...cards].sort((a, b) => Number(b.featured) - Number(a.featured))

  return (
    <div className="flex flex-col gap-5">
      {sortedCards.map((card) => (
        <div
          key={card.slug}
          className={`bg-white border border-line ${card.featured ? ' border-l-info border-l ' : 'border-line'}`}
        >
          <div className="p-3 border-b flex max-md:flex-col max-md:items-start gap-3 items-center justify-between border-line">
            <div className="flex items-center gap-3 flex-wrap">
              {card.featured && (
                <div className="bg-chip-bg border-chip-border text-info px-1.5 py-1 flex items-center gap-2 text-xs uppercase">
                  <div className="w-3 h-3">
                    <Image src={Star} alt="" />
                  </div>
                  featured
                </div>
              )}

              {card.categories.map((item) => (
                <div
                  key={item}
                  className={`px-1.5 py-1 flex items-center gap-2 text-xs uppercase ${getCategoryStyle(item)}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="text-muted text-xs flex-nowrap text-nowrap">
              {card.day} • {card.time} UTC
            </div>{' '}
          </div>

          <div className="flex gap-6 justify-between py-4 px-3">
            <div>
              <div className="text-base font-medium">{card.title}</div>
              <div className="text-sm text-muted ">{card.subtitle}</div>
            </div>

            <div className="p-2 justify-center h-max flex flex-col items-center bg-paper min-w-[78px] max-md:h-[78px]">
              <div className={`font-medium text-meta text-sm font-mono uppercase`}>
                {card.profitably ? 'Yes' : 'No'}{' '}
              </div>
              <div className={`font-medium text-xl max-md:text-lg font-mono uppercase`}>
                {card.profitably ? card.yesPrice : card.noPrice}{' '}
              </div>
              <div
                className={`font-medium text-meta text-sm font-mono uppercase ${card.profitably ? 'text-success' : 'text-negative'}`}
              >
                {card.profitablyPP}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 p-3 border-t border-line">
            <div className="flex flex-col gap-1">
              <div className="text-muted uppercase font-mono font-medium text-xs">
                {card.featured ? 'Polymarket ' : 'YES PRICE'}
              </div>
              <div className="text-positive uppercase font-mono font-medium text-lg">
                {card.yesPrice}
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
              <div className="text-muted uppercase font-mono font-medium text-xs">
                {card.featured ? 'KALSHI' : 'NO PRICE'}
              </div>
              <div className="text-negative uppercase font-mono font-medium text-lg">
                {card.noPrice}
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
              <div className="text-muted uppercase font-mono font-medium text-xs">
                {card.featured ? 'SPREAD' : '24H VOLUME'}
              </div>
              <div
                className={`uppercase font-mono font-medium text-lg ${card.featured ? 'text-spread' : ''}`}
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
