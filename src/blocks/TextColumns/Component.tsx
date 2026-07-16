import type { PageBlock } from '@/blocks/types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<PageBlock, { blockType: 'text-columns' }>

const cols: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

export function TextColumnsBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns as string) ?? '2'] ?? cols['2']
  const items = block.items ?? []
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className={`grid gap-8 ${colClass}`}>
          {items.map((item, i) => (
            <div key={i}>
              {item.heading && <h3 className="text-xl font-semibold mb-2">{item.heading}</h3>}
              {item.content && (
                <div className="prose prose-sm">
                  <RichText data={item.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
