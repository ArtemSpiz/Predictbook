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

export async function InfiniteScroll() {
  const items = [...InfiniteScrollData, ...InfiniteScrollData]

  return (
    <div className="bg-[#221E1D] py-3 gap-2 flex items-center w-full overflow-hidden">
      <div className="flex gap-2 w-max animate-infinite-scroll">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div key={i} className="flex items-center gap-1">
              <div className="text-[#FFFFFF80] text-sm text-nowrap">{item.title}</div>
              <div className="text-[#FFFFFF] text-sm   text-nowrap">{item.subtitle}</div>
              <div className="text-[#57B96F] text-sm   text-nowrap">{item.price}</div>
            </div>

            <div className="w-px h-4 bg-[#FFFFFF1F]" />
          </div>
        ))}
      </div>
    </div>
  )
}
