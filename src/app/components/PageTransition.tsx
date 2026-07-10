'use client'

import { usePathname } from 'next/navigation'

/** Re-keys on route change so the enter animation replays for each page. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
