import { Article } from '@/app/Mock/BlogMockData'
import Image from 'next/image'
import Live from '../../../../public/live.png'
import Facebook from '../../../../public/Facebook.png'
import X from '../../../../public/XBlog.png'
import Copy from '../../../../public/Copy.png'
import AnotherBlogs from './AnotherBlogs'

interface Props {
  article: Article
}

const Contacts = [
  {
    icon: X,
    link: '',
  },
  {
    icon: Facebook,
    link: '',
  },
  {
    icon: Copy,
    link: '',
  },
]

export default function BlogSlug({ article }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
      <div className="flex items-center gap-2">
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

      <div className="text-2xl font-bold">{article.title}</div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[#5D554F] mb-1 text-base">{article.name}</div>
          <div className="text-[#5D554F] text-base">
            {article.day} • {article.time}
          </div>
        </div>

        <div className="flex gap-1 items-center self-stretch">
          {Contacts.map((card, i) => (
            <div
              key={i}
              className="border border-[#E1DDD5] cursor-pointer rounded-md w-10 h-10 flex justify-center items-center"
            >
              {' '}
              <Image src={card.icon} alt="" className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-[#E1DDD5]" />

      {/* буде одним контентом */}
      <div className="flex flex-col gap-6">
        {article.image && (
          <img src={article.image.src} alt={article.title} className="w-full rounded-xl" />
        )}

        <p>{article.text}</p>
      </div>

      <div className="w-full h-px bg-[#E1DDD5]" />

      <AnotherBlogs currentSlug={article.slug} />
    </div>
  )
}
