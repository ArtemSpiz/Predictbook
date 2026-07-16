// src/blocks/RealCard/Component.tsx
import Image from 'next/image'
import CustomBtn from '@/app/ui/CustomBtn'
import type { Media } from '@/payload-types'
import { ScrollFollow } from './ScrollFollow'

type RealCardBlockProps = {
  badgeIcon: Media | string
  badgeText: string
  showLiveDot?: boolean | null
  title: string
  description: string
  buttonText: string
  buttonUrl?: string | null
  backgroundImage: Media | string
  scrollFollow?: boolean | null
}

function getMediaUrl(media: Media | string | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return ''
  return media.url ?? ''
}

function getMediaAlt(media: Media | string | undefined): string {
  if (!media || typeof media === 'string') return ''
  return media.alt ?? ''
}

export function RealCardBlockComponent({ block }: { block: RealCardBlockProps }) {
  const {
    badgeIcon,
    badgeText,
    showLiveDot = true,
    title,
    description,
    buttonText,
    buttonUrl,
    backgroundImage,
    scrollFollow = true,
  } = block

  return (
    <ScrollFollow enabled={scrollFollow}>
      <div className="relative bg-ink p-6 flex flex-col gap-4">
        <div className="flex gap-3 relative items-center">
          <div className="bg-ink-2 p-2 relative rounded">
            <Image
              src={getMediaUrl(badgeIcon)}
              alt={getMediaAlt(badgeIcon)}
              width={16}
              height={16}
              className="w-4 h-4"
            />
            {showLiveDot && (
              <div className="w-2 h-2 rounded-full -top-0.5 -right-0.5 p-0.5 absolute bg-live-a24">
                <div className="w-1 h-1 rounded-full bg-live" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="text-white-a80 text-xs font-medium">{badgeText}</div>
          </div>
        </div>

        <div>
          <div className="text-white font-medium text-2xl mb-2 md:max-w-[150px]">{title}</div>
          <div className="text-cream text-sm">{description}</div>
        </div>

        <CustomBtn text={buttonText} {...(buttonUrl ? { href: buttonUrl } : {})} />

        <div className="max-w-[155px] h-auto absolute top-[40%] -translate-y-1/2 right-0">
          <Image
            src={getMediaUrl(backgroundImage)}
            alt={getMediaAlt(backgroundImage)}
            width={155}
            height={155}
            className="w-full h-auto"
          />
        </div>
      </div>
    </ScrollFollow>
  )
}
