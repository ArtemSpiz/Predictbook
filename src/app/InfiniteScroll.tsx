import type { Ticker } from '@/payload-types'

const MIN_ITEMS = 12

export function InfiniteScroll({ items: source }: { items: Ticker[] }) {
  if (!source.length) return null

  const base: Ticker[] = []
  while (base.length < MIN_ITEMS) base.push(...source)
  const items = [...base, ...base]

  return (
    <div className="bg-ink py-3 gap-2 flex items-center w-full overflow-hidden">
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
