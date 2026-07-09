import type { Metadata } from 'next'
import AboutMain from '@/app/components/About/AboutMain'
import Feed from '@/app/components/Home/Feed'
import RealCard from '@/app/components/Home/RealCard'
import { getAboutPageContent } from '@/utilities/getPageContent'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { liveFeedToView } from '@/app/lib/viewModels'
import { localeAlternates } from '@/utilities/metadataAlternates'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPageContent()
  return {
    title: content?.title ?? 'About Predictbook',
    ...localeAlternates('about'),
  }
}

export default async function About() {
  const [content, feed] = await Promise.all([getAboutPageContent(), findLiveFeed({ limit: 1 })])
  const feedItems = feed.docs.map(liveFeedToView)
  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <AboutMain content={content} />
        </div>
        <div className="w-full h-px bg-line md:hidden" />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <Feed
            heading="Live Feed"
            viewAllText="All threads"
            viewAllUrl="/live-feed"
            items={feedItems}
          />
          <RealCard />
        </div>
      </div>
    </main>
  )
}
