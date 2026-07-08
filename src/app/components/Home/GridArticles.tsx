import gridImg from '../../../../public/gridImg.png'
import AllBtn from '@/app/ui/AllBtn'
import BlockTitle from '@/app/ui/BlockTitle'
import ArticleCard from '@/app/ui/ArticleCard'

const ArticlesContent = [
  {
    underTitle: 'DEVELOPING',
    image: gridImg,
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['AI', 'REGULATION'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
  {
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
    day: 'Today',
    time: '12:00',
    categories: ['MARKETS', 'ELECTIONS'],
  },
]

export default async function GridArticles() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3 pr-5">
        <BlockTitle title="Analysis" subtitle="Expert perspectives behind market movements." />
        <AllBtn text="All articles" />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {ArticlesContent.map((card, i) => (
          <ArticleCard key={i} card={card} />
        ))}
      </div>
    </div>
  )
}
