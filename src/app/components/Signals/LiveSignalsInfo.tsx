'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SignalsInfo, { type SignalTab } from './SignalsInfo'
import { useLiveSignals } from '@/app/hooks/useLiveSignals'
import type { LiveSignalView } from '@/app/lib/viewModels'

const tabFromParam = (v: string | null): SignalTab =>
  v === 'whales' || v === 'whale'
    ? 'whale'
    : v === 'arbitrages' || v === 'arbitrage'
      ? 'arbitrage'
      : 'all'

interface Props {
  title: string
  subtitle?: string
  delayText?: string
  initialCount: number
  initialItems: LiveSignalView[]
  initialLatest: string | null
  limit: number
}

/** Client shell around SignalsInfo that prepends freshly polled signals. */
export default function LiveSignalsInfo({
  title,
  subtitle,
  delayText,
  initialCount,
  initialItems,
  initialLatest,
  limit,
}: Props) {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<SignalTab>(tabFromParam(searchParams.get('tab')))

  const { freshItems } = useLiveSignals({ initialLatest, limit })
  const fresh = new Set(freshItems.map((i) => i.slug))
  const items = [...freshItems, ...initialItems.filter((i) => !fresh.has(i.slug))]
  return (
    <SignalsInfo
      title={title}
      subtitle={subtitle}
      delayText={delayText}
      count={initialCount + freshItems.length}
      items={items}
      activeTab={tab}
      onTabChange={setTab}
    />
  )
}
