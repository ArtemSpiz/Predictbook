'use client'

import { useLiveTicker } from '@/app/hooks/useLiveTicker'

const MIN_ITEMS = 12

interface TickerItem {
  venue: string
  market: string
  price: string
}

export function InfiniteScroll({ items: initialItems }: { items: TickerItem[] }) {
  const { freshItems } = useLiveTicker()
  const source = freshItems && freshItems.length ? freshItems : initialItems
  if (!source.length) return null

  const base: TickerItem[] = []
  while (base.length < MIN_ITEMS) base.push(...source)
  const items = [...base, ...base]

  return (
    <div className="bg-ink py-3 gap-2 flex items-center w-full overflow-hidden">
      {/* Positional keys keep DOM nodes stable on live updates so the marquee animation never restarts. */}
      <div className="flex gap-2 w-max animate-infinite-scroll">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="text-white-a50 text-sm text-nowrap">{item.venue}</div>
              <div className="text-white text-sm text-nowrap">{item.market}</div>
              <div className="text-positive text-sm text-nowrap">{item.price}</div>
            </div>

            <div className="w-px h-4 bg-white-a12" />
          </div>
        ))}
      </div>
    </div>
  )
}
