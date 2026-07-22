import Summary, { SummaryItem } from '@/app/components/Home/Summary'
import BlockTitle from '@/app/ui/BlockTitle'
import { PreferredSourceButton } from '@/app/ui/PreferredSourceButton'
import { getSignalsSummary } from '@/utilities/getSignalsSummary'

type SummaryBlock = {
  title?: string | null
  subtitle?: string | null
  buttonUrl?: string | null
  buttonText?: string | null
  tabs: {
    title: string
    infoTitle: string
    buttonUrl?: string | null
    buttonText?: string | null
    day?: string | null
    time?: string | null
    info: {
      text: string
    }[]
  }[]
}

export async function SummaryBlockComponent({ block }: { block: SummaryBlock }) {
  // Per-tab button link, matched to a CMS tab by title (then by position),
  // falling back to the block-level default.
  const tabUrl = (title: string, index: number) =>
    block.tabs?.find((t) => t.title.toLowerCase() === title.toLowerCase())?.buttonUrl ||
    block.tabs?.[index]?.buttonUrl ||
    block.buttonUrl ||
    '/signals'

  // Per-tab button label, matched to a CMS tab the same way, falling back to the
  // block-level default (then, in SummaryCard, to "Read <tab title>").
  const tabText = (title: string, index: number) =>
    block.tabs?.find((t) => t.title.toLowerCase() === title.toLowerCase())?.buttonText ||
    block.tabs?.[index]?.buttonText ||
    block.buttonText ||
    undefined

  // Daily/Weekly summaries are derived from the signals collection; the CMS tabs
  // are only used as a fallback when there are no signals to summarise.
  const derived = await getSignalsSummary()
  const summaries: SummaryItem[] =
    derived.length > 0
      ? derived.map((d, i) => ({ ...d, buttonUrl: tabUrl(d.title, i), buttonText: tabText(d.title, i) }))
      : block.tabs.map((tab) => ({
          title: tab.title,
          infoTitle: tab.infoTitle,
          day: tab.day ?? 'Today',
          time: tab.time ?? '20:00',
          info: tab.info.map((i) => i.text),
          buttonUrl: tab.buttonUrl || block.buttonUrl || '/signals',
          buttonText: tab.buttonText || block.buttonText || undefined,
        }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3">
        <BlockTitle title={block?.title ?? ''} subtitle={block?.subtitle ?? undefined} />
      </div>

      <Summary summaries={summaries} buttonUrl={block.buttonUrl ?? '/signals'} />

      <PreferredSourceButton />
    </div>
  )
}
