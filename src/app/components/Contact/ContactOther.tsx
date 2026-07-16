import Image from 'next/image'
import BtnArrow from '@/../public/BtnArrow.png'
import { PayloadImage } from '@/app/components/PayloadImage'
import { EXTERNAL_REL } from '@/app/ui/ExternalLink'
import type { Media } from '@/payload-types'

export interface ContactMethod {
  id?: string | null
  icon?: Media | number | string | null
  title: string
  linkText: string
  link?: string | null
}

export interface ContactSocial {
  id?: string | null
  icon?: Media | number | string | null
  link: string
}

interface Props {
  heading?: string
  methods?: ContactMethod[] | null
  socials?: ContactSocial[] | null
  socialsHeading?: string
}

export default function ContactOther({ heading = '', methods, socials, socialsHeading }: Props) {
  return (
    <div className="bg-sand border-line p-6 flex flex-col gap-4">
      <div className="font-medium">{heading}</div>

      <div className="flex flex-col gap-4">
        {methods?.map((card) => (
          <div key={card.id} className="flex items-center gap-3">
            <div className="w-8 h-8">
              <PayloadImage media={card.icon} className="w-8 h-8 object-contain" alt="" />
            </div>

            <div>
              <div className="text-muted text-sm">{card.title}</div>
              <a href={card.link || undefined} className="text-sm cursor-pointer flex items-center">
                <span className="underline">{card.linkText}</span>
                <Image src={BtnArrow} alt="" className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {socials && socials.length > 0 && (
        <div className="border-t border-muted-a16 pt-4 flex items-center justify-between">
          <div className="font-medium">{socialsHeading}</div>

          <div className="flex items-center gap-3">
            {socials.map((item, i) => (
              <a
                className="w-8 h-8"
                key={item.id ?? i}
                href={item.link || undefined}
                target="_blank"
                rel={EXTERNAL_REL}
              >
                <PayloadImage media={item.icon} className="w-8 h-8 object-contain" alt="" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
