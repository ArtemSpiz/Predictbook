import { arbitrageCards, whaleCards } from '@/app/Mock/HomeMockData'
import Alert, { AlertCard } from './Alert'
import ArticleType from './ArticlesType'
import Feed from './Feed'
import GridArticles from './GridArticles'
import RealCard from './RealCard'
import Summary from './Summary'
import ArticleTypeMobileSwitcher from './ArticleTypeMobileSwitcher'
import Signals from './Signals' 
import { ArticlesContent } from '@/app/Mock/BlogMockData' 

export default async function Main() {
  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5 w-full  md:max-w-[300px]">
          <Signals>
            <Alert title="Whale Alert" cards={whaleCards} />
            <div className="w-full h-px bg-[#E1DDD5]" />
            <Alert title="Arbitrage Alert" cards={arbitrageCards} />
            <div className="w-full h-px bg-[#E1DDD5]" />
          </Signals>

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
            politicsCards={ArticlesContent}
            sportsCards={ArticlesContent}
            cryptoCards={ArticlesContent}
          />

          <div className="max-xl:hidden flex flex-col gap-5">
            <ArticleType title="Politics" cards={ArticlesContent} />
            <div className="w-full h-px bg-[#E1DDD5] " />
            <ArticleType title="Sports" cards={ArticlesContent} />
            <div className="w-full h-px bg-[#E1DDD5] " />
            <ArticleType title="Crypto" cards={ArticlesContent} />
          </div>
          <div className="w-full h-px bg-[#E1DDD5] " />
        </div>
      </div>
    </div>
  )
}
