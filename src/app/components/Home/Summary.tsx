'use client'

import { useEffect, useRef, useState } from 'react'
import SummaryCard from '@/app/ui/SummaryCard'

export interface SummaryItem {
  title: string
  infoTitle: string
  info: string[]
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
  {
    title: 'Weekly summary',
    infoTitle: 'Weekly Market Pulse',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
]

export default function Summary({ summaries }: { summaries?: SummaryItem[] }) {
  const TypeSummary = summaries && summaries.length > 0 ? summaries : FALLBACK
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
    const btn = btnRefs.current[active]
    if (btn) {
      setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [active])

  return (
    <div className="flex flex-col gap-5">
      <div className="relative mx-auto w-full justify-between flex rounded-xl bg-white p-1 gap-2">
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-ink shadow-sm transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: sliderStyle.left, width: sliderStyle.width }}
        />
        {TypeSummary.map((item, i) => (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            onClick={() => handleSwitch(i)}
            className={`relative z-10 px-4 py-2 w-[48%] rounded-lg text-sm bg-transparent transition-colors duration-300 ${
              active === i ? 'text-paper-2' : 'text-muted '
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <SummaryCard
        title={card.title}
        infoTitle={card.infoTitle}
        info={card.info}
        direction={direction}
        active={active}
      />
    </div>
  )
}
