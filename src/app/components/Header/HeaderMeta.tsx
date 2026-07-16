'use client'

import { useEffect, useState } from 'react'
import { SignalsTodayBadge } from '@/app/ui/SignalsTodayBadge'

export function HeaderMeta({ signalsToday }: { signalsToday: number }) {
  const [today, setToday] = useState('')
  useEffect(() => {
    const d = new Date()
    const base = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    setToday(`${base} · ${d.getFullYear()}`)
  }, [])

  return (
    <div className="flex items-center gap-4 max-lg:w-full max-lg:justify-between max-lg:py-3 max-lg:px-5 max-md:px-0">
      <div className="text-muted text-sm">{today}</div>
      <SignalsTodayBadge count={signalsToday} />
    </div>
  )
}
