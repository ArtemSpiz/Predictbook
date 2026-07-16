import Link from 'next/link'
import { SocialLinks, type SocialItem } from '@/app/ui/SocialLinks'

export function FooterBrand({
  brandName,
  tagline,
  social,
}: {
  brandName?: string | null
  tagline?: string | null
  social: SocialItem[]
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-3xl m-0 font-bold text-white">
          <Link href="/">{brandName}</Link>
        </h2>
        <div className="mt-2 text-sm text-white-a80">{tagline}</div>
      </div>
      <SocialLinks items={social} className="flex items-center gap-3" linkClassName="w-8 h-8" />
    </div>
  )
}
