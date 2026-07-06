import Image from 'next/image'
import type { Media } from '@/payload-types'

type Props = {
  media: Media | string | number | null | undefined
  className?: string
  sizes?: string
  priority?: boolean
  /** Fallback alt when the media has none. */
  alt?: string
}

/**
 * `next/image` wrapper for a Payload Media relation. Uses the upload's intrinsic
 * `width`/`height` (stored by Payload) to avoid layout shift. Renders nothing
 * for unpopulated relations or non-image uploads without dimensions.
 */
export function PayloadImage({ media, className, sizes, priority, alt }: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const { url, width, height } = media
  if (!width || !height) return null
  return (
    <Image
      src={url}
      alt={media.alt ?? alt ?? ''}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
