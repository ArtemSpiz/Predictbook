'use client'

import { useEffect, useState } from 'react'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

function format(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  for (const [unit, secs] of UNITS) {
    if (seconds >= secs) return rtf.format(-Math.floor(seconds / secs), unit)
  }
  return 'just now'
}

/** Live "x minutes ago" label. Renders nothing without a timestamp. */
export function RelativeTime({ iso, className }: { iso?: string | null; className?: string }) {
  const [label, setLabel] = useState<string>(() => (iso ? format(iso) : ''))

  useEffect(() => {
    if (!iso) return
    setLabel(format(iso))
    const id = setInterval(() => setLabel(format(iso)), 60000)
    return () => clearInterval(id)
  }, [iso])

  if (!iso) return null
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label}
    </time>
  )
}
