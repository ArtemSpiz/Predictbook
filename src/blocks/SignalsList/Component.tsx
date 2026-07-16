import LiveSignalsInfo from '@/app/components/Signals/LiveSignalsInfo'
import { findSignals } from '@/utilities/getSignals'
import { signalToLiveView } from '@/app/lib/viewModels'

type SignalsListBlockProps = {
  heading: string
  subtitle?: string | null
  delayText?: string | null
  limit?: number | null
}

export async function SignalsListBlockComponent({ block }: { block: SignalsListBlockProps }) {
  const limit = block.limit ?? 20
  // Arbitrage vastly outnumbers whale alerts, so the newest `limit` are almost
  // all arbitrage — fetch recent whales too, otherwise the Whales tab is empty.
  const [all, whales] = await Promise.all([
    findSignals({ limit }),
    findSignals({ kind: 'whale', limit }),
  ])
  const bySlug = new Map<string, ReturnType<typeof signalToLiveView>>()
  for (const doc of [...all.docs, ...whales.docs]) bySlug.set(doc.slug, signalToLiveView(doc))
  const items = [...bySlug.values()].sort((a, b) =>
    (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''),
  )
  return (
    <LiveSignalsInfo
      title={block.heading}
      subtitle={block.subtitle ?? undefined}
      delayText={block.delayText ?? undefined}
      initialCount={all.totalDocs}
      initialItems={items}
      initialLatest={items[0]?.publishedAt ?? null}
      limit={limit}
    />
  )
}
