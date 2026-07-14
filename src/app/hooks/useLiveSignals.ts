'use client'

import { useEffect, useRef, useState } from 'react'
import type { LiveSignalView } from '@/app/lib/viewModels'
import type { Signal } from '@/payload-types'

interface Options {
  kind?: Signal['kind']
  /** publishedAt of the newest server-rendered item; fetches start after it. */
  initialLatest: string | null
  intervalMs?: number
  limit?: number
}

/** Polls /api/signals/feed and accumulates signals newer than the initial render. */
export function useLiveSignals({ kind, initialLatest, intervalMs = 10000, limit = 20 }: Options) {
  const [freshItems, setFreshItems] = useState<LiveSignalView[]>([])
  const sinceRef = useRef(initialLatest)
  const inFlightRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      if (inFlightRef.current || document.visibilityState === 'hidden') return
      inFlightRef.current = true
      try {
        const qs = new URLSearchParams({ limit: String(limit) })
        if (sinceRef.current) qs.set('since', sinceRef.current)
        if (kind) qs.set('kind', kind)
        const res = await fetch(`/api/signals/feed?${qs}`)
        if (!res.ok) return
        const data = (await res.json()) as { items: LiveSignalView[]; latest: string | null }
        if (cancelled || data.items.length === 0) return
        if (data.latest) sinceRef.current = data.latest
        setFreshItems((prev) => {
          const seen = new Set(prev.map((i) => i.slug))
          return [...data.items.filter((i) => !seen.has(i.slug)), ...prev]
        })
      } catch {
        // Network hiccup — retry on the next tick.
      } finally {
        inFlightRef.current = false
      }
    }

    void tick()
    const id = setInterval(tick, intervalMs)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [kind, intervalMs, limit])

  return { freshItems }
}
