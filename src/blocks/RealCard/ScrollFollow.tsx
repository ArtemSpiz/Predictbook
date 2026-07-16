'use client'

import { useEffect, useRef } from 'react'

const TOP_OFFSET = 24
const EASE = 0.15

/**
 * Once the block scrolls into view, the card eases along with the page scroll,
 * staying pinned TOP_OFFSET below the viewport top and clamped inside its column.
 * Desktop-only and disabled for prefers-reduced-motion.
 */
export function ScrollFollow({
  enabled = true,
  children,
}: {
  enabled?: boolean | null
  children: React.ReactNode
}) {
  const slotRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    const slot = slotRef.current
    const card = cardRef.current
    if (!slot || !card) return

    const desktop = window.matchMedia('(min-width: 768px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    let raf = 0
    let running = false
    let current = 0

    const reset = () => {
      current = 0
      card.style.transform = ''
    }

    const frame = () => {
      const max = slot.offsetHeight - card.offsetHeight
      const target =
        max <= 0 ? 0 : Math.min(Math.max(TOP_OFFSET - slot.getBoundingClientRect().top, 0), max)
      current += (target - current) * EASE
      if (Math.abs(target - current) < 0.5) current = target
      card.style.transform = `translateY(${current}px)`
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || !desktop.matches || reduce.matches) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    })
    io.observe(slot)

    const onModeChange = () => {
      if (desktop.matches && !reduce.matches) return
      stop()
      reset()
    }
    desktop.addEventListener('change', onModeChange)
    reduce.addEventListener('change', onModeChange)

    return () => {
      io.disconnect()
      stop()
      reset()
      desktop.removeEventListener('change', onModeChange)
      reduce.removeEventListener('change', onModeChange)
    }
  }, [enabled])

  if (!enabled) return <>{children}</>

  return (
    <div ref={slotRef} className="md:h-full">
      <div ref={cardRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
