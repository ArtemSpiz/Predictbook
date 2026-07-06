import { arbitrageCards, politicsCards, whaleCards } from '@/app/Mock/HomeMockData'
import Alert, { AlertCard } from './Alert'
import ArticleType, { GridCard } from './ArticlesType'
import Feed from './Feed'
import GridArticles from './GridArticles'
import RealCard from './RealCard'
import Summary from './Summary'
import ArticleTypeMobileSwitcher from './ArticleTypeMobileSwitcher'

export default async function Main() {
  return (
    <div className="container-custom">
      <div className="border-l border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5  md:max-w-[300px]">
          <Alert title="Whale Alert" cards={whaleCards} />
          <div className="w-full h-px bg-[#E1DDD5]" />

          <Alert title="Arbitrage Alert" cards={arbitrageCards} />
          <div className="w-full h-px bg-[#E1DDD5] " />

          <Summary />
          <div className="w-full h-px bg-[#E1DDD5] " />
          <RealCard />

          <div className="w-full h-px bg-[#E1DDD5] mt-3 md:hidden" />
        </div>

        <div className="md:border-l border-[#E1DDD5] flex flex-col gap-5 md:pl-5 flex-1">
          <GridArticles />
          <div className="w-full h-px bg-[#E1DDD5] " />
          <Feed />
          <div className="w-full h-px bg-[#E1DDD5] " />
          <ArticleTypeMobileSwitcher
            politicsCards={politicsCards}
            sportsCards={politicsCards}
            cryptoCards={politicsCards}
          />

          <div className="max-xl:hidden flex flex-col gap-5">
            <ArticleType title="Politics" cards={politicsCards} />
            <div className="w-full h-px bg-[#E1DDD5] " />
            <ArticleType title="Sports" cards={politicsCards} />
            <div className="w-full h-px bg-[#E1DDD5] " />
            <ArticleType title="Crypto" cards={politicsCards} />
          </div>
          <div className="w-full h-px bg-[#E1DDD5] " />
        </div>
      </div>
    </div>
  )
}
