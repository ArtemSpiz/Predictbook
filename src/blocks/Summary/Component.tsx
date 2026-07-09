import Summary, { SummaryItem } from '@/app/components/Home/Summary'

type SummaryBlock = {
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

export function SummaryBlockComponent({ block }: { block: SummaryBlock }) {
  const summaries: SummaryItem[] = block.tabs.map((tab) => ({
    title: tab.title,
    infoTitle: tab.infoTitle,
    day: tab.day ?? 'Today',
    time: tab.time ?? '20:00',
    info: tab.info.map((i) => i.text),
  }))

  return <Summary summaries={summaries} />
}
