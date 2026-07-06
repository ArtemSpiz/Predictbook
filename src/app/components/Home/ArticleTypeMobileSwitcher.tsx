'use client'

import { useEffect, useRef, useState } from 'react'
import ArticleType, { GridCard } from './ArticlesType'

interface ArticleTypeMobileSwitcherProps {
  politicsCards: GridCard[]
  sportsCards: GridCard[]
  cryptoCards: GridCard[]
}

const tabs = ['Politics', 'Sports', 'Crypto']

export default function ArticleTypeMobileSwitcher({
  politicsCards,
  sportsCards,
  cryptoCards,
}: ArticleTypeMobileSwitcherProps) {
  const [active, setActive] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })

  const cardsByIndex = [politicsCards, sportsCards, cryptoCards]

  const updateSlider = (index: number) => {
    const btn = btnRefs.current[index]
    if (btn) {
      setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }

  useEffect(() => {
    updateSlider(active)

    const handleResize = () => updateSlider(active)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [active])

  const handleSwitch = (i: number) => setActive(i)

  return (
    <div className="xl:hidden flex flex-col gap-3 w-full">
      <div>
        <div className="font-semibold text-base">Explore by Category</div>
        <div className="text-sm text-[#5D554F]">
          The latest articles from our most-followed prediction market topics.
        </div>
      </div>
      <div className="relative mx-auto w-full justify-between flex rounded-xl bg-white p-1 gap-2 border border-[#E1DDD5]">
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-[#221E1D] shadow-sm transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: sliderStyle.left, width: sliderStyle.width }}
        />
        {tabs.map((title, i) => (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            onClick={() => handleSwitch(i)}
            className={`relative z-10 flex-1 px-4 py-2 rounded-lg text-sm bg-transparent transition-colors duration-300 ${
              active === i ? 'text-[#F7F6F5]' : 'text-[#5D554F]'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      <ArticleType title={tabs[active]} cards={cardsByIndex[active]} />
    </div>
  )
}
