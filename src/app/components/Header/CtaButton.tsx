import Link from 'next/link'

export function CtaButton({
  label,
  href,
  className,
}: {
  label?: string | null
  href?: string | null
  className: string
}) {
  if (!label) return null
  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <button className={className} type="button">
      {label}
    </button>
  )
}
