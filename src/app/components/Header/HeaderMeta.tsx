'use client'

import { useEffect, useState } from 'react'

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
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full p-0.5  bg-success-a24 ">
          <div className="w-1 h-1 rounded-full bg-success" />
        </div>
        <div className="text-success text-sm">{signalsToday} signals today</div>
      </div>
    </div>
  )
}
