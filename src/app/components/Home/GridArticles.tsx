import AllBtn from '@/app/ui/AllBtn'
import BlockTitle from '@/app/ui/BlockTitle'
import ArticleCard from '@/app/ui/ArticleCard'
import Link from 'next/link'
import type { ArticleView } from '@/app/lib/viewModels'

interface GridArticlesProps {
  heading: string
  subtitle?: string
  viewAllText: string
  viewAllUrl: string
  articles: ArticleView[]
}

export default function GridArticles({
  heading,
  subtitle,
  viewAllText,
  viewAllUrl,
  articles,
}: GridArticlesProps) {
  const sortedCards = [...articles].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3 pr-5">
        <BlockTitle title={heading} subtitle={subtitle} />
        <AllBtn text={viewAllText} link={viewAllUrl} />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {sortedCards.map((card) => (
          <Link
            key={card.slug}
            href={`/news/${card.slug}`}
            className={`${card.featured ? 'xl:col-span-2' : ''}`}
          >
            <ArticleCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
