import type { PageBlock, Media } from '@/payload-types'

type Block = Extract<PageBlock, { blockType: 'image-grid' }>

const cols: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
  '6': 'md:grid-cols-6',
}

interface Item {
  image: Media | string
  caption?: string
}

export function ImageGridBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns as string) ?? '3'] ?? cols['3']
  const images = (block.images ?? []) as Item[]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className={`grid gap-4 grid-cols-2 ${colClass}`}>
          {images.map((item, i) => {
            const img = typeof item.image === 'object' ? item.image : null
            if (!img?.url) return null
            return (
              <figure key={i}>
                <img
                  src={img.url}
                  alt={img.alt ?? item.caption ?? ''}
                  className="w-full h-auto rounded"
                />
                {item.caption && (
                  <figcaption className="text-sm text-gray-500 mt-1 text-center">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
