import type { PageBlock } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<PageBlock, { blockType: 'rich-text-block' }>

const widths: Record<string, string> = {
  prose: 'max-w-prose',
  wide: 'max-w-5xl',
  full: 'max-w-none',
}

export function RichTextBlockComponent({ block }: { block: Block }) {
  const widthClass = widths[(block.maxWidth as string) ?? 'prose'] ?? widths.prose
  return (
    <section className="px-6 py-12">
      <div className={`mx-auto prose prose-lg ${widthClass}`}>
        <RichText data={block.content} />
      </div>
    </section>
  )
}
