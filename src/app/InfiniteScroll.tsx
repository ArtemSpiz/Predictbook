const InfiniteScrollData = [
  {
    title: 'Kalshi',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 61¢',
  },
  {
    title: 'Polymarket',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 12¢',
  },
  {
    title: 'Kalshi',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 61¢',
  },
  {
    title: 'Polymarket',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 12¢',
  },
  {
    title: 'Kalshi',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 61¢',
  },
  {
    title: 'Polymarket',
    subtitle: 'Czechia vs Mexico Winner?',
    price: ' 12¢',
  },
]

export function InfiniteScroll() {
  const items = [...InfiniteScrollData, ...InfiniteScrollData]

  return (
    <div className="bg-ink py-3 gap-2 flex items-center w-full overflow-hidden">
      <div className="flex gap-2 w-max animate-infinite-scroll">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div key={i} className="flex items-center gap-1">
              <div className="text-white-a50 text-sm text-nowrap">{item.title}</div>
              <div className="text-white text-sm   text-nowrap">{item.subtitle}</div>
              <div className="text-positive text-sm   text-nowrap">{item.price}</div>
            </div>

            <div className="w-px h-4 bg-white-a12" />
          </div>
        ))}
      </div>
    </div>
  )
}
