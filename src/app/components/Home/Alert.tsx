import Image from 'next/image'
import Clock from '../../../../public/time.png'
import CustomBtn from '@/app/ui/CustomBtn'
import { ExternalLink } from '@/app/ui/ExternalLink'

export type AlertCard = {
  type: 'arbitrage' | 'whale'
  underTitle: string
  time: string
  title: string

  size?: string
  odds?: string
  probable?: boolean

  poly?: string
  kalshi?: string
  spread?: string

  polyUrl?: string
  kalshiUrl?: string
  marketUrl?: string
}

type AlertProps = {
  title: string
  cards: AlertCard[]
  delayLabel?: string
  viewAllText: string
  viewAllUrl?: string
}

export default function Alert({ title, cards, delayLabel, viewAllText, viewAllUrl }: AlertProps) {
  return (
    <div>
      <div className="bg-white border border-solid border-line mb-3">
        <div className="flex items-center p-3 justify-between ">
          <div className="font-semibold leading-none text-lg">{title}</div>

          <div className="flex text-xs items-center  gap-2 text-muted">
            <Image src={Clock} alt="" className="w-3 h-3" />
            {delayLabel && <span>{delayLabel}</span>}
          </div>
        </div>

        <div className="flex flex-col">
          {cards.map((card, i) => (
            <div key={i} className="border-t border-line py-3 px-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`py-1 px-1.5 border border-solid text-nowrap text-xs uppercase max-h-[20px] leading-none ${
                    card.underTitle === 'whale alert'
                      ? 'border-cat-whale-border text-cat-whale-text bg-cat-whale-bg'
                      : 'border-cat-arb-border bg-cat-arb-bg text-cat-arb-text'
                  }`}
                >
                  {card.underTitle}
                </div>

                <div className="text-muted text-xs">{card.time} UTC</div>
              </div>

              <div className="font-medium text-base mb-3">
                <ExternalLink href={card.marketUrl} className="hover:underline">
                  {card.title}
                </ExternalLink>
              </div>

              {card.type === 'arbitrage' ? (
                <div className="flex  items-center gap-2 text-sm uppercase font-medium">
                  <div>
                    <span className="mr-2 text-meta ">POLY</span>
                    <ExternalLink href={card.polyUrl} className="hover:underline">
                      {card.poly}
                    </ExternalLink>
                  </div>

                  <div>
                    <span className="mr-2 text-meta">KALSHI</span>
                    <ExternalLink href={card.kalshiUrl} className="text-live hover:underline">
                      {card.kalshi}
                    </ExternalLink>
                  </div>

                  <div>
                    <span className="mr-2 text-meta">SPREAD</span>
                    <span className="text-success">{card.spread}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-8 text-sm uppercase font-medium">
                  <div>
                    <span className="mr-2 text-meta">SIZE</span>
                    {card.size}
                  </div>

                  <div>
                    <span className="mr-2 text-meta">ODDS</span>
                    <span className="text-success">{card.odds}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <CustomBtn text={viewAllText} center href={viewAllUrl} />
    </div>
  )
}
