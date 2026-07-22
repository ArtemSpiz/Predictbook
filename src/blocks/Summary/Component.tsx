import Summary, { SummaryItem } from '@/app/components/Home/Summary'
import BlockTitle from '@/app/ui/BlockTitle'
import { PreferredSourceButton } from '@/app/ui/PreferredSourceButton'
import { getSignalsBullets, getSignalsSummary } from '@/utilities/getSignalsSummary'

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
    autoPeriod?: ('off' | '1d' | '3d' | '7d' | '30d' | 'custom') | null
    autoDays?: number | null
    info?: {
      text: string
    }[]
  }[]
}

const PRESET_DAYS: Record<string, number> = { '1d': 1, '3d': 3, '7d': 7, '30d': 30 }

const autoDaysFor = (tab: SummaryBlock['tabs'][number]): number | null => {
  const period = tab.autoPeriod
  if (!period || period === 'off') return null
  if (period === 'custom') return tab.autoDays && tab.autoDays > 0 ? tab.autoDays : null
  return PRESET_DAYS[period] ?? null
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

  // CMS tabs take precedence: if any are configured, render them as-is. Only when
  // none are configured do we fall back to Daily/Weekly summaries derived from the
  // signals collection.
  const hasCmsTabs = (block.tabs?.length ?? 0) > 0
  const summaries: SummaryItem[] = hasCmsTabs
    ? await Promise.all(
        block.tabs.map(async (tab) => {
          const manual = tab.info?.map((i) => i.text) ?? []
          const days = autoDaysFor(tab)
          const auto = days ? await getSignalsBullets(days) : []
          return {
            title: tab.title,
            infoTitle: tab.infoTitle,
            day: tab.day ?? 'Today',
            time: tab.time ?? '20:00',
            info: [...manual, ...auto],
            buttonUrl: tab.buttonUrl || block.buttonUrl || '/signals',
            buttonText: tab.buttonText || block.buttonText || undefined,
          }
        }),
      )
    : (await getSignalsSummary()).map((d, i) => ({
        ...d,
        buttonUrl: tabUrl(d.title, i),
        buttonText: tabText(d.title, i),
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
