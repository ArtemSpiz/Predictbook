import Image from 'next/image'
import Star from '../../../../public/StarFeatured.png'
import { CategoryChip } from '@/app/ui/CategoryChips'
import { ExternalLink } from '@/app/ui/ExternalLink'
import { sortByFeatured, type SignalView } from '@/app/lib/viewModels'

export default function SignalsCard({ cards }: { cards: SignalView[] }) {
  const sortedCards = sortByFeatured(cards)

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
                <CategoryChip
                  key={item}
                  category={item}
                  className="px-1.5 py-1 flex items-center gap-2 text-xs uppercase"
                />
              ))}
            </div>
            <div className="text-muted text-xs flex-nowrap text-nowrap">
              {card.day} • {card.time} UTC
            </div>{' '}
          </div>

          <div className="py-4 px-3">
            <div className="text-xs uppercase font-medium text-muted mb-1">
              {card.kind === 'whale' ? 'Whale Alert' : 'Arbitrage Alert'}
            </div>
            <div className="text-base font-medium">
              <ExternalLink href={card.marketUrl} className="hover:underline">
                {card.title}
              </ExternalLink>
            </div>
          </div>

          <div className="grid grid-cols-2 p-3 border-t border-line">
            <div className="flex flex-col gap-1">
              <div className="text-muted uppercase font-mono font-medium text-xs">
                {card.featured ? 'Polymarket ' : 'YES PRICE'}
              </div>
              <ExternalLink
                href={card.polyUrl}
                className="text-positive uppercase font-mono font-medium text-lg hover:underline"
              >
                {card.yesPrice}
              </ExternalLink>
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
              <div className="text-muted uppercase font-mono font-medium text-xs">
                {card.featured ? 'KALSHI' : 'NO PRICE'}
              </div>
              <ExternalLink
                href={card.kalshiUrl}
                className="text-negative uppercase font-mono font-medium text-lg hover:underline"
              >
                {card.noPrice}
              </ExternalLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
