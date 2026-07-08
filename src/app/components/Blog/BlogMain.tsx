import BlockTitle from '@/app/ui/BlockTitle'
import SummaryCard from '@/app/ui/SummaryCard'
import BlogCol from './BlogsCol'
import { Suspense } from 'react'

const TypeSummary = [
  {
    title: 'Daily summary',
    infoTitle: 'Daily Market Pulse — Monday June 9',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
  {
    title: 'Weekly summary',
    infoTitle: 'Weekly Market Pulse — Monday June 9',
    info: [
      'Fed cut odds hit 63¢ — 6pt jump from Friday close',
      'Nvidia arb window opened briefly, now closed at 48¢',
      'Kalshi recession market surges on PMI miss',
    ],
  },
]

export default function BlogMain() {
  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-[#E1DDD5] md:pr-5 max-lg:pl-5 max-md:pl-0">
          <Suspense fallback={<div>Loading...</div>}>
            <BlogCol />
          </Suspense>
        </div>

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <BlockTitle
            title="Summary"
            subtitle="A concise recap of the market's biggest moves, key signals, and what mattered most."
          />
          <SummaryCard
            title={TypeSummary[0].title}
            infoTitle={TypeSummary[0].infoTitle}
            info={TypeSummary[0].info}
          />

          <SummaryCard
            title={TypeSummary[1].title}
            infoTitle={TypeSummary[1].infoTitle}
            info={TypeSummary[1].info}
          />
        </div>
      </div>
    </div>
  )
}
