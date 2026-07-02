'use client'
import { useEffect, useState } from 'react'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'stats' }>

interface Item {
  value: string
  label: string
  description?: string
  animateCounter?: boolean
}

function parseNumeric(s: string): { num: number; prefix: string; suffix: string } | null {
  const match = s.match(/^([^\d.-]*)([\d,.-]+)([^\d.]*)$/)
  if (!match) return null
  const num = parseFloat(match[2].replace(/,/g, ''))
  if (isNaN(num)) return null
  return { num, prefix: match[1] ?? '', suffix: match[3] ?? '' }
}

function CounterValue({ value, animate }: { value: string; animate: boolean }) {
  const [display, setDisplay] = useState(value)
  const parsed = parseNumeric(value)

  useEffect(() => {
    if (!animate || !parsed) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 1500
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = parsed.num * eased
      setDisplay(parsed.prefix + Math.round(current).toLocaleString() + parsed.suffix)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, animate, parsed])

  return <span>{display}</span>
}

export function StatsClient({ block, useGsap: _useGsap }: { block: Block; useGsap: boolean }) {
  const items = (block.items ?? []) as Item[]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CounterValue value={item.value} animate={item.animateCounter ?? true} />
              </div>
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
