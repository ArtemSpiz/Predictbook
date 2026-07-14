'use client'

import { useEffect, useRef, useState } from 'react'
import type { TickerFeedItem } from '@/app/api/ticker/feed/route'

const INTERVAL_MS = 30000

/** Polls /api/ticker/feed and returns fresh rows only when their content actually changed. */
export function useLiveTicker() {
  const [freshItems, setFreshItems] = useState<TickerFeedItem[] | null>(null)
  const snapshotRef = useRef<string | null>(null)
  const inFlightRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      if (inFlightRef.current || document.visibilityState === 'hidden') return
      inFlightRef.current = true
      try {
        const res = await fetch('/api/ticker/feed')
        if (!res.ok) return
        const data = (await res.json()) as { items: TickerFeedItem[] }
        if (cancelled || data.items.length === 0) return
        const snapshot = data.items.map((i) => `${i.venue}|${i.market}|${i.price}`).join('\n')
        if (snapshot === snapshotRef.current) return
        snapshotRef.current = snapshot
        setFreshItems(data.items)
      } catch {
        // Network hiccup — retry on the next tick.
      } finally {
        inFlightRef.current = false
      }
    }

    const id = setInterval(tick, INTERVAL_MS)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { freshItems }
}
