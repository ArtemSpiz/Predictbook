import { ImageResponse } from 'next/og'
import { getNewsPostBySlug } from '@/utilities/getNewsPosts'
import { siteConfig } from '@/utilities/siteConfig'
import { ogImageElement, ogImageSize } from '@/app/lib/ogTemplate'

export const size = ogImageSize
export const contentType = 'image/png'
export const alt = 'Analysis article'
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  return new ImageResponse(
    ogImageElement({
      title: post?.title ?? siteConfig.name,
      label: 'Analysis',
      siteName: siteConfig.name,
    }),
    ogImageSize,
  )
}
