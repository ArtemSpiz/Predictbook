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
  const res = await findSignals({ limit })
  const items = res.docs.map(signalToLiveView)
  return (
    <LiveSignalsInfo
      title={block.heading}
      subtitle={block.subtitle ?? undefined}
      delayText={block.delayText ?? undefined}
      initialCount={res.totalDocs}
      initialItems={items}
      initialLatest={items[0]?.publishedAt ?? null}
      limit={limit}
    />
  )
}
