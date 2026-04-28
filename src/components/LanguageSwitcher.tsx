'use client'
import { useState, useEffect } from 'react'
import { locales, defaultLocale } from '@/i18n/config'

export function LanguageSwitcher() {
  const [current, setCurrent] = useState(defaultLocale)

  useEffect(() => {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('NEXT_LOCALE='))
    if (cookie) setCurrent(cookie.split('=')[1])
  }, [])

  const change = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <select
      value={current}
      onChange={(e) => change(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
