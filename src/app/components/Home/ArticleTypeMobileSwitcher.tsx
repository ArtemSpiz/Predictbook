'use client'

import { useEffect, useRef, useState } from 'react'
import ArticleType from './ArticlesType'
import type { CategorySectionData } from '@/blocks/CategorySection/CategorySections'

interface ArticleTypeMobileSwitcherProps {
  header: { title: string; subtitle?: string | null }
  sections: CategorySectionData[]
}

export default function ArticleTypeMobileSwitcher({
  header,
  sections,
}: ArticleTypeMobileSwitcherProps) {
  const [active, setActive] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })
  const activeRef = useRef(0)

  const updateSlider = (index: number) => {
    const btn = btnRefs.current[index]
    if (btn) setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
  }

  useEffect(() => {
    activeRef.current = active
    updateSlider(active)
  }, [active])

  useEffect(() => {
    const handleResize = () => updateSlider(activeRef.current)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (sections.length === 0) return null
  const current = sections[Math.min(active, sections.length - 1)]

  return (
    <div className="xl:hidden flex flex-col gap-3 w-full">
      <div>
        <div className="font-semibold text-base">{header.title}</div>
        {header.subtitle && <div className="text-sm text-muted">{header.subtitle}</div>}
      </div>
      <div className="relative mx-auto w-full justify-between flex overflow-x-auto no-scrollbar rounded-xl bg-white p-1 gap-2 border border-line">
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-ink shadow-sm transition-all duration-350 ease-smooth"
          style={{ left: sliderStyle.left, width: sliderStyle.width }}
        />
        {sections.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            onClick={() => setActive(i)}
            className={`relative z-10 flex-1 whitespace-nowrap px-4 py-2 rounded-lg text-sm bg-transparent transition-colors duration-300 ${
              active === i ? 'text-paper-2' : 'text-muted'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ArticleType
        title={current.label}
        accent={current.accent}
        viewAllText={current.viewAllText}
        viewAllUrl={current.viewAllUrl}
        cards={current.cards}
      />
    </div>
  )
}
