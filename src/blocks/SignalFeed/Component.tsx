import LiveAlert from '@/app/components/Home/LiveAlert'
import { findSignals } from '@/utilities/getSignals'
import { signalToLiveView } from '@/app/lib/viewModels'

type SignalFeedBlockProps = {
  heading: string
  kind: 'whale' | 'arbitrage'
  delayLabel?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function SignalFeedBlockComponent({ block }: { block: SignalFeedBlockProps }) {
  const limit = block.limit ?? 3
  const res = await findSignals({ kind: block.kind, limit })
  const items = res.docs.map(signalToLiveView)
  return (
    <LiveAlert
      title={block.heading}
      kind={block.kind}
      delayLabel={block.delayLabel ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? undefined}
      limit={limit}
      initialItems={items}
      initialLatest={items[0]?.publishedAt ?? null}
    />
  )
}
