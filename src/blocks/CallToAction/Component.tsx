import type { PageBlock } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

type Block = Extract<PageBlock, { blockType: 'call-to-action' }>

export function CallToActionBlock({ block }: { block: Block }) {
  return (
    <section className="px-6 py-16 text-center bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{block.heading}</h2>
        {block.description && (
          <div className="mb-6">
            <RichText data={block.description} />
          </div>
        )}
        {Array.isArray(block.buttons) && block.buttons.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {block.buttons.map((btn: { link?: any }, i: number) => {
              const link = btn.link
              const href =
                link?.type === 'reference' && typeof link.reference?.value === 'object'
                  ? `/${link.reference.value.slug ?? ''}`
                  : link?.url ?? '#'
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
