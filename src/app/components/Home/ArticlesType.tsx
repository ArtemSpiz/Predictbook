import AllBtn from '@/app/ui/AllBtn'
import Link from 'next/link'
import { PayloadImage } from '@/app/components/PayloadImage'
import { accentClasses } from '@/blocks/_shared/accent'
import type { ArticleView } from '@/app/lib/viewModels'

interface ArticleTypeProps {
  title: string
  accent: string
  viewAllText: string
  viewAllUrl: string
  cards: ArticleView[]
}

export default function ArticleType({
  title,
  accent,
  viewAllText,
  viewAllUrl,
  cards,
}: ArticleTypeProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-2xl max-md:text-base">{title}</div>
        <AllBtn text={viewAllText} link={viewAllUrl} />
      </div>

      <div className="grid xl:grid-cols-3 gap-2">
        {cards.map((card) => (
          <Link
            href={`/analysis/${card.slug}`}
            key={card.slug}
            className="bg-white border border-line border-solid"
          >
            {card.image && (
              <div className="w-full h-auto">
                <PayloadImage media={card.image} alt="" className="w-full h-auto" />
              </div>
            )}

            <div className="p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div
                  className={`py-1 px-1.5 border border-solid text-xs uppercase ${accentClasses(accent)}`}
                >
                  {title}
                </div>
                <div className="text-xs text-date flex-nowrap text-nowrap">
                  {card.day} · {card.time}
                </div>
              </div>

              <div>
                <div className="font-medium text-base mt-1">{card.title}</div>
                <div className="text-sm line-clamp-3 text-muted">{card.text}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
