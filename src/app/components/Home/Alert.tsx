import Image from 'next/image'
import Clock from '../../../../public/time.png'
import CustomBtn from '@/app/ui/CustomBtn'

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
}

type AlertProps = {
  title: string
  cards: AlertCard[]
}

export default function Alert({ title, cards }: AlertProps) {
  return (
    <div>
      <div className="bg-white border border-solid border-line mb-3">
        <div className="flex items-center p-3 justify-between ">
          <div className="font-semibold text-lg">{title}</div>

          <div className="flex items-center gap-2 text-muted">
            <Image src={Clock} alt="" className="w-3 h-3" />
            <span>30-min delay</span>
          </div>
        </div>

        <div className="flex flex-col">
          {cards.map((card, i) => (
            <div key={i} className="border-t border-line p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`py-1 px-1.5 border border-solid text-xs uppercase ${
                    card.underTitle === 'whale alert'
                      ? 'border-cat-whale-border text-cat-whale-text bg-cat-whale-bg'
                      : 'border-cat-arb-border bg-cat-arb-bg text-cat-arb-text'
                  }`}
                >
                  {card.underTitle}
                </div>

                <div className="text-muted text-xs">{card.time} UTC</div>
              </div>

              <div className="font-medium text-base mb-4">{card.title}</div>

              {card.type === 'arbitrage' ? (
                <div className="flex  items-center gap-2 text-sm uppercase font-medium">
                  <div>
                    <span className="mr-2 text-meta ">POLY</span>
                    <span>{card.poly}</span>
                  </div>

                  <div>
                    <span className="mr-2 text-meta">KALSHI</span>
                    <span className="text-live">{card.kalshi}</span>
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

      <CustomBtn text="View all whale alerts" center />
    </div>
  )
}
