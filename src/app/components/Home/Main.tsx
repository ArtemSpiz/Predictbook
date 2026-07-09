import Alert from './Alert'
import ArticleType from './ArticlesType'
import Feed from './Feed'
import GridArticles from './GridArticles'
import RealCard from './RealCard'
import Summary from './Summary'
import ArticleTypeMobileSwitcher from './ArticleTypeMobileSwitcher'
import Signals from './Signals'
import type { SummaryItem } from './Summary'
import { findSignals } from '@/utilities/getSignals'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { getHomePageContent } from '@/utilities/getPageContent'
import { blogToArticleView, liveFeedToView, signalToAlert } from '@/app/lib/viewModels'

const DEFAULT_SECTIONS = ['Politics', 'Sports', 'Crypto']

export default async function Main() {
  const [whale, arbitrage, posts, feed, content] = await Promise.all([
    findSignals({ kind: 'whale', limit: 3 }),
    findSignals({ kind: 'arbitrage', limit: 3 }),
    findBlogPosts({ limit: 30 }),
    findLiveFeed({ limit: 5 }),
    getHomePageContent(),
  ])

  const articles = posts.docs.map(blogToArticleView)
  const feedItems = feed.docs.map(liveFeedToView)
  const whaleAlerts = whale.docs.map(signalToAlert)
  const arbitrageAlerts = arbitrage.docs.map(signalToAlert)
  const summaries = (content?.summaries ?? []).map((s) => ({
    title: s.title,
    infoTitle: s.infoTitle,
    info: (s.info ?? []).map((i) => i.text),
  })) as SummaryItem[]
  const sections =
    content?.articleSections && content.articleSections.length > 0
      ? content.articleSections.map((s) => s.label)
      : DEFAULT_SECTIONS

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5 w-full  md:max-w-[300px]">
          <Signals>
            <Alert
              title="Whale Alert"
              cards={whaleAlerts}
              delayLabel="30-min delay"
              viewAllText="View all whale alerts"
            />
            <div className="w-full h-px bg-line" />
            <Alert
              title="Arbitrage Alert"
              cards={arbitrageAlerts}
              delayLabel="30-min delay"
              viewAllText="View all arbitrage alerts"
            />
            <div className="w-full h-px bg-line" />
          </Signals>

          <Summary summaries={summaries} />
          <div className="w-full h-px bg-line " />
          <RealCard />

          <div className="w-full h-px bg-line mt-3 md:hidden" />
        </div>

        <div className="md:border-l border-line flex flex-col gap-5 md:pl-5 flex-1">
          <GridArticles
            heading="Analysis"
            subtitle="Expert perspectives behind market movements."
            viewAllText="All articles"
            viewAllUrl="/blog"
            articles={articles.slice(0, 5)}
          />
          <div className="w-full h-px bg-line " />
          <Feed
            heading="Live Feed"
            viewAllText="All threads"
            viewAllUrl="/live-feed"
            items={feedItems.slice(0, 1)}
          />
          <div className="w-full h-px bg-line " />
          <ArticleTypeMobileSwitcher header={{ title: 'Explore by Category' }} sections={[]} />

          <div className="max-xl:hidden flex flex-col gap-5">
            {sections.map((title, i) => (
              <div key={title} className="flex flex-col gap-5">
                <ArticleType
                  title={title}
                  accent="politics"
                  viewAllUrl={`/blog/category/${title.toLowerCase()}`}
                  cards={articles}
                />
                {i < sections.length - 1 && <div className="w-full h-px bg-line " />}
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-line " />
        </div>
      </div>
    </div>
  )
}
