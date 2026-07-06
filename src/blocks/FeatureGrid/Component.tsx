import type { Media } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'feature-grid' }>

const cols: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

interface Item {
  icon?: Media | string | null
  title: string
  description?: string
}

export function FeatureGridBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns as string) ?? '3'] ?? cols['3']
  const items = (block.items ?? []) as Item[]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-2">{block.heading}</h2>
        )}
        {block.subheading && (
          <p className="text-center text-gray-600 mb-10">{block.subheading}</p>
        )}
        <div className={`grid gap-8 ${colClass}`}>
          {items.map((item, i) => {
            const icon = typeof item.icon === 'object' ? item.icon : null
            return (
              <div key={i} className="text-center">
                {icon?.url && (
                  <img
                    src={icon.url}
                    alt={icon.alt ?? ''}
                    className="w-12 h-12 mx-auto mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
