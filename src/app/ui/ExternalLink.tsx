import type { ReactNode } from 'react'

// External links are nofollow by default: signals/alerts add many outbound
// market links and we don't want to pass ranking signal to them.
export const EXTERNAL_REL = 'nofollow noopener noreferrer'

export function ExternalLink({
  href,
  className,
  title,
  children,
}: {
  href?: string | null
  className?: string
  title?: string
  children: ReactNode
}) {
  // Without a URL, still render a styled span so callers keep their className
  // (colours, etc.) instead of dropping to bare text.
  if (!href) return <span className={className}>{children}</span>
  return (
    <a href={href} target="_blank" rel={EXTERNAL_REL} className={className} title={title}>
      {children}
    </a>
  )
}
