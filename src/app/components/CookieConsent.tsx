'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pb-cookie-consent'

type ConsentChoice = 'granted' | 'denied'
type Gtag = (...args: unknown[]) => void

const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const

/** Updates Google Consent Mode. AnalyticsScripts sets the defaults to `denied`;
 * this grants them once the visitor accepts (and re-grants on later visits). */
function grantConsent() {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag }
  w.dataLayer = w.dataLayer || []
  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
  }
  w.gtag('consent', 'update', GRANTED)
}

export function CookieConsent({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentChoice | null
    if (stored === 'granted') {
      grantConsent()
    } else if (!stored) {
      setVisible(true)
    }
  }, [enabled])

  if (!enabled || !visible) return null

  const choose = (choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice)
    if (choice === 'granted') grantConsent()
    setVisible(false)
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl bg-ink p-4 text-white shadow-lg">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm">
          We use cookies to analyse traffic and improve your experience. See our{' '}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose('denied')}
            className="rounded-lg border border-sand-a32 px-4 py-2 text-sm text-ink transition-colors hover:bg-white-a24"
          >
            Decline
          </button>
          <button
            onClick={() => choose('granted')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
