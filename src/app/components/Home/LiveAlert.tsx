'use client'

import Alert from './Alert'
import { useLiveSignals } from '@/app/hooks/useLiveSignals'
import { liveViewToAlert, type LiveSignalView } from '@/app/lib/viewModels'
import type { Signal } from '@/payload-types'

interface Props {
  title: string
  kind: Signal['kind']
  delayLabel?: string
  viewAllText: string
  viewAllUrl?: string
  limit: number
  initialItems: LiveSignalView[]
  initialLatest: string | null
}

/** Client shell around the Alert feed that prepends freshly polled signals. */
export default function LiveAlert({
  title,
  kind,
  delayLabel,
  viewAllText,
  viewAllUrl,
  limit,
  initialItems,
  initialLatest,
}: Props) {
  const { freshItems } = useLiveSignals({ kind, initialLatest, limit })
  const fresh = new Set(freshItems.map((i) => i.slug))
  const merged = [...freshItems, ...initialItems.filter((i) => !fresh.has(i.slug))].slice(0, limit)
  return (
    <Alert
      title={title}
      cards={merged.map(liveViewToAlert)}
      delayLabel={delayLabel}
      viewAllText={viewAllText}
      viewAllUrl={viewAllUrl}
    />
  )
}
