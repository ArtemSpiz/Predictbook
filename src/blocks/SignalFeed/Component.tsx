import Alert from '@/app/components/Home/Alert'
import { findSignals } from '@/utilities/getSignals'
import { signalToAlert } from '@/app/lib/viewModels'

type SignalFeedBlockProps = {
  heading: string
  kind: 'whale' | 'arbitrage'
  delayLabel?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function SignalFeedBlockComponent({ block }: { block: SignalFeedBlockProps }) {
  const res = await findSignals({ kind: block.kind, limit: block.limit ?? 3 })
  const cards = res.docs.map(signalToAlert)
  return (
    <Alert
      title={block.heading}
      cards={cards}
      delayLabel={block.delayLabel ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? undefined}
    />
  )
}
