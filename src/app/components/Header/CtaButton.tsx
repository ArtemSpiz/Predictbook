import Link from 'next/link'

const HOVER =
  'transition duration-200 ease-out hover:brightness-125 hover:-translate-y-px active:translate-y-0 active:brightness-100 cursor-pointer'

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
  const classes = `${HOVER} ${className}`
  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    )
  }
  return (
    <button className={classes} type="button">
      {label}
    </button>
  )
}
