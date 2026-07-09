import SignalsInfo from '@/app/components/Signals/SignalsInfo'
import { findSignals } from '@/utilities/getSignals'
import { signalToView } from '@/app/lib/viewModels'

type SignalsListBlockProps = {
  heading: string
  subtitle?: string | null
  delayText?: string | null
  limit?: number | null
}

export async function SignalsListBlockComponent({ block }: { block: SignalsListBlockProps }) {
  const res = await findSignals({ limit: block.limit ?? 20 })
  const items = res.docs.map(signalToView)
  return (
    <SignalsInfo
      title={block.heading}
      subtitle={block.subtitle ?? undefined}
      delayText={block.delayText ?? undefined}
      count={res.totalDocs}
      items={items}
    />
  )
}
