import Image from 'next/image'
import Star from '../../../../public/StarFeatured.png'
import { CategoryChip } from '@/app/ui/CategoryChips'
import { ExternalLink } from '@/app/ui/ExternalLink'
import { SignalKindBadge } from '@/app/ui/SignalKindBadge'
import { sortByFeatured, type SignalView } from '@/app/lib/viewModels'
import { isWalletAddress } from '@/lib/signals-sync/mapItem'

const venueUrl = (venue: string | undefined, poly?: string, kalshi?: string, fallback?: string) =>
  venue?.toLowerCase().includes('poly') ? (poly ?? fallback) : (kalshi ?? fallback)

const isPolymarket = (platform?: string) => platform?.toLowerCase().includes('poly') ?? false

function WhaleAddress({ card }: { card: SignalView }) {
  const polyAddress =
    isPolymarket(card.platform) && isWalletAddress(card.address) ? card.address : undefined
  return (
    <div className="text-muted text-sm mt-1">
      Address:{' '}
      {polyAddress ? (
        <ExternalLink
          href={`https://polymarket.com/${polyAddress}`}
          className="text-info hover:underline break-all"
        >
          {polyAddress}
        </ExternalLink>
      ) : (
        'unknown'
      )}
    </div>
  )
}

function ArbitrageFooter({ card }: { card: SignalView }) {
  return (
    <div className="grid grid-cols-3 p-3 border-t border-line">
      <div className="flex flex-col gap-1">
        <div className="text-muted uppercase font-mono font-medium text-xs">
          YES{card.yesVenue ? ` · ${card.yesVenue}` : ''}
        </div>
        <ExternalLink
          href={venueUrl(card.yesVenue, card.polyUrl, card.kalshiUrl, card.marketUrl)}
          className="text-positive uppercase font-mono font-medium text-lg hover:underline"
        >
          {card.yesPrice}
        </ExternalLink>
      </div>
      <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
        <div className="text-muted uppercase font-mono font-medium text-xs">
          NO{card.noVenue ? ` · ${card.noVenue}` : ''}
        </div>
        <ExternalLink
          href={venueUrl(card.noVenue, card.polyUrl, card.kalshiUrl, card.marketUrl)}
          className="text-negative uppercase font-mono font-medium text-lg hover:underline"
        >
          {card.noPrice}
        </ExternalLink>
      </div>
      <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
        <div className="text-muted uppercase font-mono font-medium text-xs">Spread</div>
        <div className="text-success uppercase font-mono font-medium text-lg">{card.spread}</div>
      </div>
    </div>
  )
}

function WhaleFooter({ card }: { card: SignalView }) {
  return (
    <div className="grid grid-cols-3 p-3 border-t border-line">
      <div className="flex flex-col gap-1">
        <div className="text-muted uppercase font-mono font-medium text-xs">Side</div>
        <div className="uppercase font-mono font-medium text-lg">
          {card.side} <span className="text-success">{card.odds}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
        <div className="text-muted uppercase font-mono font-medium text-xs">Size</div>
        <div className="uppercase font-mono font-medium text-lg">{card.size}</div>
      </div>
      <div className="flex flex-col gap-1 pl-3 border-l border-l-line">
        <div className="text-muted uppercase font-mono font-medium text-xs">Platform</div>
        <div className="uppercase font-mono font-medium text-lg">{card.platform}</div>
      </div>
    </div>
  )
}

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
              <SignalKindBadge kind={card.kind} />

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
            <div className="text-base font-medium">
              <ExternalLink href={card.marketUrl} className="hover:underline">
                {card.title}
              </ExternalLink>
            </div>
            {card.kind === 'whale' && (
              <>
                {card.subtitle && (
                  <div className="text-muted text-sm mt-1">Market Outcome: {card.subtitle}</div>
                )}
                <WhaleAddress card={card} />
              </>
            )}
          </div>

          {card.kind === 'whale' ? <WhaleFooter card={card} /> : <ArbitrageFooter card={card} />}
        </div>
      ))}
    </div>
  )
}
