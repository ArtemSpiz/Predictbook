import type { ReactNode } from 'react'

/** Shared pill button used by the analysis category filter and the signals tabs. */
export function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 px-4 rounded-lg text-sm transition-colors ${
        active ? 'text-ink bg-sand' : 'text-muted bg-white'
      }`}
    >
      {children}
    </button>
  )
}
