import starterConfig from '../../../starter.config'
import type { Media } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'logo-cloud' }>

interface Logo {
  image: Media | string
  name?: string
}

export async function LogoCloudBlock({ block }: { block: Block }) {
  const logos = (block.logos ?? []) as Logo[]

  if (starterConfig.features.swiper) {
    const { LogoCloudCarousel } = await import('./Component.client')
    return <LogoCloudCarousel block={block} />
  }

  return (
    <section className="px-6 py-12">
      {block.heading && (
        <h2 className="text-2xl font-semibold text-center mb-8">{block.heading}</h2>
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
        {logos.map((logo, i) => {
          const img = typeof logo.image === 'object' ? logo.image : null
          return img?.url ? (
            <img
              key={i}
              src={img.url}
              alt={logo.name ?? img.alt ?? ''}
              className="h-12 mx-auto opacity-70 hover:opacity-100"
            />
          ) : null
        })}
      </div>
    </section>
  )
}
