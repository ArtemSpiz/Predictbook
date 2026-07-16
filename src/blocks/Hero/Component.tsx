import type { Media } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { resolveLinkHref, type LinkValue } from '@/utilities/resolveLinkHref'

type HeroBlock = Extract<PageBlock, { blockType: 'hero' }>

export function HeroBlock({ block }: { block: HeroBlock }) {
  const bg = block.background as { type?: string; image?: Media; video?: Media } | undefined
  const bgImage = bg?.image && typeof bg.image === 'object' ? bg.image.url : undefined
  const bgVideo = bg?.video && typeof bg.video === 'object' ? bg.video.url : undefined

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center text-center px-6 py-20"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {bg?.type === 'video' && bgVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          src={bgVideo}
        />
      )}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{block.heading}</h1>
        {block.subheading && (
          <div className="text-lg md:text-xl mb-8 opacity-90">
            <RichText data={block.subheading} />
          </div>
        )}
        {Array.isArray(block.ctas) && block.ctas.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {block.ctas.map((cta: { link?: LinkValue }, i: number) => {
              const link = cta.link
              const href = resolveLinkHref(link)
              return (
                <Link
                  key={i}
                  href={href}
                  target={link?.newTab ? '_blank' : undefined}
                  className="inline-block px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {link?.label ?? 'Learn more'}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
