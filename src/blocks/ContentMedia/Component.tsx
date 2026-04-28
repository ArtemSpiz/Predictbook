import type { PageBlock, Media } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<PageBlock, { blockType: 'content-media' }>

interface Section {
  heading?: string
  content?: any
  image?: Media | string | null
}

export function ContentMediaBlock({ block }: { block: Block }) {
  const sections = (block.sections ?? []) as Section[]
  return (
    <section className="px-6 py-12">
      {block.heading && (
        <h2 className="text-3xl font-bold text-center mb-12 max-w-6xl mx-auto">{block.heading}</h2>
      )}
      <div className="max-w-6xl mx-auto space-y-16">
        {sections.map((section, i) => {
          const img = typeof section.image === 'object' ? section.image : null
          const reverse = i % 2 === 1
          return (
            <div
              key={i}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                reverse ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div>
                {img?.url && (
                  <img src={img.url} alt={img.alt ?? ''} className="w-full rounded" />
                )}
              </div>
              <div>
                {section.heading && (
                  <h3 className="text-2xl font-semibold mb-3">{section.heading}</h3>
                )}
                {section.content && (
                  <div className="prose">
                    <RichText data={section.content} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
