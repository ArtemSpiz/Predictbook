import Summary, { SummaryItem } from '@/app/components/Home/Summary'
import BlockTitle from '@/app/ui/BlockTitle'
import { getSignalsSummary } from '@/utilities/getSignalsSummary'

type SummaryBlock = {
  title?: string | null
  subtitle?: string | null
  tabs: {
    title: string
    infoTitle: string
    day?: string | null
    time?: string | null
    info: {
      text: string
    }[]
  }[]
}

export async function SummaryBlockComponent({ block }: { block: SummaryBlock }) {
  // Daily/Weekly summaries are derived from the signals collection; the CMS tabs
  // are only used as a fallback when there are no signals to summarise.
  const derived = await getSignalsSummary()
  const summaries: SummaryItem[] =
    derived.length > 0
      ? derived
      : block.tabs.map((tab) => ({
          title: tab.title,
          infoTitle: tab.infoTitle,
          day: tab.day ?? 'Today',
          time: tab.time ?? '20:00',
          info: tab.info.map((i) => i.text),
        }))

  return (
    <div className="flex flex-col gap-3">
      <BlockTitle title={block?.title ?? ''} subtitle={block?.subtitle ?? undefined} />

      <Summary summaries={summaries} />
    </div>
  )
}
