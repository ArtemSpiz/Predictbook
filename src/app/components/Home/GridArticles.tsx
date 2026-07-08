import gridImg from '../../../../public/gridImg.png'
import AllBtn from '@/app/ui/AllBtn'
import BlockTitle from '@/app/ui/BlockTitle'
import ArticleCard from '@/app/ui/ArticleCard'
import { ArticlesContent } from '@/app/Mock/BlogMockData'
import Link from 'next/link'

export default async function GridArticles() {
  const sortedCards = [...ArticlesContent]
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3 pr-5">
        <BlockTitle title="Analysis" subtitle="Expert perspectives behind market movements." />

        <AllBtn text="All articles" link="/blog" />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {sortedCards.map((card, i) => (
          <Link
            key={card.slug}
            href={`/blog/${card.slug}`}
            className={`${card.featured ? 'xl:col-span-2' : ''}`}
          >
            <ArticleCard key={i} card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
