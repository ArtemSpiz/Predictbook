import AllBtn from '@/app/ui/AllBtn'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

export interface GridCard {
  slug: string
  image: StaticImageData
  type: string
  day: string
  time: string
  title: string
  text: string
}
interface ArticleTypeProps {
  title: string
  cards: GridCard[]
}
 
export default function ArticleType({ title, cards }: ArticleTypeProps) {

  const filteredCards = cards
  .filter((card) =>
    card.categories?.some(
      (category) => category.toLowerCase() === title.toLowerCase()
    )
  )
  .slice(0, 3)


  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-2xl max-md:text-base">{title}</div>
        <AllBtn text="All articles" link={`/blog/category/${title.toLowerCase()}`}/>
      </div>

      <div className="grid xl:grid-cols-3 gap-2">
        {filteredCards.map((card, i) => (
          <Link  href={`/blog/${card.slug}`}  key={i} className="bg-white border border-[#E1DDD5] border-solid">
            <div className="w-full h-auto">
              <Image src={card.image} alt="" />
            </div>

            <div className="p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div
                  className={`py-1 px-1.5 border border-solid text-xs uppercase 
                    ${title === 'Politics' && 'border-[#D4D2EA] text-[#444263] bg-[#F0EFFE]'} 
                    ${title === 'Sports' && 'border-[#D1E9D4] text-[#4A654F] bg-[#F2FEF3]'}
                    ${title === 'Crypto' && 'border-[#E9E9D1] text-[#655E4A] bg-[#FEFDF2]'}`}
                >
                  {title}
                </div>

                <div className="text-sm text-[#7D7169]">
                  {card.day} · {card.time}
                </div>
              </div>

              <div>
                <div className="font-medium text-base mt-1">{card.title}</div>
                <div className="text-sm line-clamp-3 text-[#5D554F]">{card.text}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
