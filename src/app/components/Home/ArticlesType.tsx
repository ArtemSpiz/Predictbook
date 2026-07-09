import AllBtn from '@/app/ui/AllBtn'
import Link from 'next/link'
import { PayloadImage } from '@/app/components/PayloadImage'
import type { ArticleView } from '@/app/lib/viewModels'

interface ArticleTypeProps {
  title: string
  cards: ArticleView[]
}

export default function ArticleType({ title, cards }: ArticleTypeProps) {
  const filteredCards = cards
    .filter((card) =>
      card.categories.some((category) => category.toLowerCase() === title.toLowerCase()),
    )
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-2xl max-md:text-base">{title}</div>
        <AllBtn text="All articles" link={`/blog/category/${title.toLowerCase()}`} />
      </div>

      <div className="grid xl:grid-cols-3 gap-2">
        {filteredCards.map((card) => (
          <Link
            href={`/blog/${card.slug}`}
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
                  className={`py-1 px-1.5 border border-solid text-xs uppercase
                    ${title === 'Politics' && 'border-cat-politics-border text-cat-politics-text bg-cat-politics-bg'}
                    ${title === 'Sports' && 'border-cat-sports-border text-cat-sports-text bg-cat-sports-bg'}
                    ${title === 'Crypto' && 'border-cat-crypto-border text-cat-crypto-text bg-cat-crypto-bg'}`}
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
