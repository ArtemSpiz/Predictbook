'use client'
import { useEffect, useRef, useState } from 'react'
import SummaryCard from '@/app/ui/SummaryCard'

export interface SummaryItem {
  title: string
  infoTitle: string
  info: string[]
  day?: string
  time?: string
  buttonUrl?: string
}

const FALLBACK: SummaryItem[] = [
  {
    title: 'Daily summary',
    infoTitle: 'Daily Market Pulse',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
]

export default function Summary({
  summaries,
  buttonUrl = '/signals',
}: {
  summaries?: SummaryItem[]
  buttonUrl?: string
}) {
  const TypeSummary = summaries && summaries.length > 0 ? summaries : FALLBACK
  const hasTabs = TypeSummary.length > 1

  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const card = TypeSummary[active]

  const handleSwitch = (i: number) => {
    if (i === active) return
    setDirection(i > active ? 1 : -1)
    setActive(i)
  }

  useEffect(() => {
    if (!hasTabs) return
    const btn = btnRefs.current[active]
    if (btn) {
      setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [active, hasTabs])

  return (
    <div>
      {hasTabs && (
        <div className="relative flex rounded-lg bg-sand-4 p-1 justify-center ">
          <span
            className="absolute top-1 bottom-1 rounded-lg bg-ink shadow-sm transition-all duration-350 ease-smooth"
            style={{ left: sliderStyle.left, width: sliderStyle.width }}
          />
          {TypeSummary.map((item, i) => (
            <button
              key={i}
              ref={(el) => {
                btnRefs.current[i] = el
              }}
              onClick={() => handleSwitch(i)}
              className={`relative z-10 px-4 py-2 text-nowrap w-[48%] rounded-lg text-sm bg-transparent transition-colors duration-300 ${
                active === i ? 'text-paper-2' : 'text-muted'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      <SummaryCard
        title={card.title}
        infoTitle={card.infoTitle}
        info={card.info}
        day={card.day}
        time={card.time}
        direction={direction}
        active={active}
        buttonUrl={card.buttonUrl ?? buttonUrl}
      />
    </div>
  )
}
