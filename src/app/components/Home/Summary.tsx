'use client'

import { useEffect, useRef, useState } from 'react'
import CustomBtn from '@/app/ui/CustomBtn'

const TypeSummary = [
  {
    title: 'Daily summary',
    infoTitle: 'Daily Market Pulse — Monday June 9',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
  {
    title: 'Weekly summary',
    infoTitle: 'Weekly Market Pulse — Monday June 9',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
]

export default function Summary() {
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
          className="absolute top-1 bottom-1 rounded-lg bg-[#221E1D] shadow-sm transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: sliderStyle.left, width: sliderStyle.width }}
        />
        {TypeSummary.map((item, i) => (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            onClick={() => handleSwitch(i)}
            className={`relative z-10 px-4 py-2 w-[45%] rounded-lg text-sm bg-transparent transition-colors duration-300 ${
              active === i ? 'text-[#F7F6F5]' : 'text-[#5D554F] '
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="overflow-hidden  border border-solid border-[#E1DDD5]">
        <div className="flex items-center justify-between border-b border-[#E1DDD5] bg-white p-4">
          <div className="text-xs uppercase text-black">{card.title}</div>
          <div className="text-xs text-[#5D554F]">Today · 20:00</div>
        </div>

        <div className="flex flex-col gap-4 bg-[#E8E0D8] p-4 overflow-hidden">
          <div
            key={active}
            style={{ '--dir': direction } as React.CSSProperties}
            className="space-y-3 animate-info-in"
          >
            <div className="text-lg font-semibold">{card.infoTitle}</div>

            <ul className="space-y-2 pl-0 text-sm text-[#5D554F]">
              {card.info.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#221E1D] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-md:hidden">
            <CustomBtn text={`Read ${card.title.toLowerCase()}`} center light />
          </div>
        </div>
      </div>

    </div>
  )
}
