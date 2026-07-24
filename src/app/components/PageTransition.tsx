'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Re-keys on route change so the enter animation replays for each page. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // The animated wrapper's transform offsets Next's scroll-into-view target on
  // soft navigation, so reset to the top ourselves (skip hash/anchor links).
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
