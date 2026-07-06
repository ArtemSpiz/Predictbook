import type { Media } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<PageBlock, { blockType: 'media-with-text' }>

export function MediaWithTextBlock({ block }: { block: Block }) {
  const m = block.media as { type?: string; image?: Media; video?: Media } | undefined
  const img = m?.type === 'image' && typeof m.image === 'object' ? m.image : null
  const vid = m?.type === 'video' && typeof m.video === 'object' ? m.video : null
  const reverse = block.mediaPosition === 'right'

  return (
    <section className="px-6 py-12">
      <div
        className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center ${
          reverse ? 'md:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div>
          {img?.url && <img src={img.url} alt={img.alt ?? ''} className="w-full rounded" />}
          {vid?.url && <video src={vid.url} controls className="w-full rounded" />}
        </div>
        <div>
          {block.heading && <h2 className="text-3xl font-bold mb-4">{block.heading}</h2>}
          <div className="prose">
            <RichText data={block.content} />
          </div>
        </div>
      </div>
    </section>
  )
}
