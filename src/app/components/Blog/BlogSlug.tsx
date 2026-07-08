import { Article } from '@/app/Mock/BlogMockData'
import Image from 'next/image'
import Live from '../../../../public/live.png'

interface Props {
  article: Article
}

export default async function BlogSlug({ article }: Props) {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex items-center gap-2 mb-4">
        {article.underTitle && (
          <div className=" bg-[#F7F4F2] px-1.5 py-1 text-xs font-bold uppercase text-[#6B42D9]">
            {article.underTitle}
          </div>
        )}

        {article.live && (
          <div className="flex h-[-webkit-fill-available] gap-2 items-center bg-[#F7DDDC] px-1.5 py-1 text-xs font-medium uppercase text-[#CF372F]">
            <Image src={Live} alt="" className="w-4 h-4" />
            LIVE
          </div>
        )}

        {article.categories.map((category) => {
          const categoryStyle =
            category.toLowerCase() === 'politics'
              ? 'bg-[#F0EFFE] border-[#D4D2EA] text-[#444263]'
              : category.toLowerCase() === 'sports'
                ? 'bg-[#F2FEF3] border-[#D1E9D4] text-[#4A654F]'
                : category.toLowerCase() === 'crypto'
                  ? 'bg-[#FEFDF2] border-[#E9E9D1] text-[#655E4A]'
                  : category.toLowerCase() === 'technology'
                    ? 'bg-[#FEF2F2] border-[#E9D1D1] text-[#654A4A]'
                    : category.toLowerCase() === 'science'
                      ? 'bg-[#EBF5FF] border-[#C7DBEC] text-[#3B586F]'
                      : 'bg-[#F4F0ED] border-[#E1DDD5] text-[#5D554F]'

          return (
            <div
              key={category}
              className={`border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs ${categoryStyle}`}
            >
              {category}
            </div>
          )
        })}
      </div>

      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      <p className="text-gray-500 mb-6">
        {article.day} • {article.time}
      </p>

      {article.image && (
        <img src={article.image.src} alt={article.title} className="w-full rounded-xl mb-6" />
      )}

      <p>{article.text}</p>
    </div>
  )
}
