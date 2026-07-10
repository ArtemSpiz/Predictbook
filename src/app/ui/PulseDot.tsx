const VARIANTS = {
  success: { ring: 'bg-success-a24', core: 'bg-success' },
  live: { ring: 'bg-live-a24', core: 'bg-live' },
}

/** Small "live" indicator: a static core with an expanding, fading pulse ring. */
export function PulseDot({
  className,
  variant = 'success',
}: {
  className?: string
  variant?: keyof typeof VARIANTS
}) {
  const c = VARIANTS[variant]
  return (
    <span className={`relative flex w-2 h-2 items-center justify-center ${className ?? ''}`}>
      <span className={`absolute inline-flex w-full h-full rounded-full ${c.ring} animate-pulse-ring`} />
      <span className={`relative inline-flex w-1 h-1 rounded-full ${c.core}`} />
    </span>
  )
}
