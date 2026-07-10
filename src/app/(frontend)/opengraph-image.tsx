import { ImageResponse } from 'next/og'
import { siteConfig } from '@/utilities/siteConfig'
import { ogImageElement, ogImageSize } from '@/app/lib/ogTemplate'

export const size = ogImageSize
export const contentType = 'image/png'
export const alt = siteConfig.name
export const revalidate = 3600

export default function Image() {
  return new ImageResponse(
    ogImageElement({ title: siteConfig.name, siteName: siteConfig.name }),
    ogImageSize,
  )
}
