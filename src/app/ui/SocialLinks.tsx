import { PayloadImage } from '@/app/components/PayloadImage'
import { EXTERNAL_REL } from '@/app/ui/ExternalLink'
import type { Media } from '@/payload-types'

export type SocialItem = { icon?: Media | string | number | null; url?: string | null }

export function SocialLinks({
  items,
  className = 'flex items-center gap-3',
  linkClassName = 'w-8 h-8',
  iconClassName,
}: {
  items: SocialItem[]
  className?: string
  linkClassName?: string
  iconClassName?: string
}) {
  if (!items?.length) return null
  return (
    <div className={className}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url ?? ''}
          target="_blank"
          rel={EXTERNAL_REL}
          className={linkClassName}
        >
          <PayloadImage media={item.icon} alt="" className={iconClassName} />
        </a>
      ))}
    </div>
  )
}
