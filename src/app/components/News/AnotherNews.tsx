import Link from 'next/link'
import BlockTitle from '@/app/ui/BlockTitle'
import ArticleCard from '@/app/ui/ArticleCard'
import Image from 'next/image'
import ArrowBack from '../../../../public/ArrowBack.png'
import type { ArticleView } from '@/app/lib/viewModels'

interface AnotherNewsProps {
  currentSlug: string
  articles: ArticleView[]
}

export default function AnotherNews({ currentSlug, articles }: AnotherNewsProps) {
  const anotherArticles = articles
    .filter((article) => article.slug !== currentSlug && !article.featured)
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-4">
      <Link href="/analysis" className="flex gap-1 items-center">
        <div className="w-3 h-3">
          <Image src={ArrowBack} alt="" />
        </div>
        <div className="text-sm">Back to Analysis</div>
      </Link>

      <BlockTitle title="More analysis from today" />

      <div className="flex flex-col gap-2">
        {anotherArticles.map((card) => (
          <Link key={card.slug} href={`/analysis/${card.slug}`}>
            <ArticleCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
