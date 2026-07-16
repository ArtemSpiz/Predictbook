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
  if (!href) return <>{children}</>
  return (
    <a href={href} target="_blank" rel={EXTERNAL_REL} className={className} title={title}>
      {children}
    </a>
  )
}
