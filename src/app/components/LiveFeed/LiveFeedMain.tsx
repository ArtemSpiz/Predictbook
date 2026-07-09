import RealCard from '../Home/RealCard'
import LiveFeedInfo from './LiveFeedInfo'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { getLiveFeedPageContent } from '@/utilities/getPageContent'
import { liveFeedToView } from '@/app/lib/viewModels'

export default async function LiveFeedMain() {
  const [feed, content] = await Promise.all([findLiveFeed({ limit: 20 }), getLiveFeedPageContent()])
  const items = feed.docs.map(liveFeedToView)

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <LiveFeedInfo items={items} content={content} />

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
        </div>
      </div>
    </div>
  )
}
