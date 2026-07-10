import { SocialLinks } from '@/app/ui/SocialLinks'
import type { Footer } from '@/payload-types'

export function FooterBrand({
  brandName,
  tagline,
  social,
}: {
  brandName?: string | null
  tagline?: string | null
  social: NonNullable<Footer['social']>
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-3xl m-0 font-bold text-white">{brandName}</h2>
        <div className="mt-2 text-sm text-white-a80">{tagline}</div>
      </div>
      <SocialLinks items={social} className="flex items-center gap-3" linkClassName="w-8 h-8" />
    </div>
  )
}
