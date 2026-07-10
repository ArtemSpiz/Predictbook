import { PayloadImage } from '@/app/components/PayloadImage'
import type { Media } from '@/payload-types'

type SponsoredCardProps = {
  heading: string
  infoIcon?: Media | string | null
  sponsors: { logo: Media | string }[]
  footerText?: string | null
}

export default function SponsoredCard({ heading, infoIcon, sponsors, footerText }: SponsoredCardProps) {
  return (
    <div className="p-6 flex flex-col gap-3 border border-line">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">{heading}</div>

        {infoIcon && (
          <div className="w-4 h-4">
            <PayloadImage media={infoIcon} className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mx-auto self-stretch">
        {sponsors.map((sponsor, i) => (
          <div key={i} className="bg-white border border-line-2 px-2 py-4 rounded-s flex justify-center items-center">
            <PayloadImage media={sponsor.logo} className="max-h-5 w-auto" />
          </div>
        ))}
      </div>

      {footerText && <div className="text-xs text-muted-5">{footerText}</div>}
    </div>
  )
}
