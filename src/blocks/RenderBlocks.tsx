/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageBlock } from '@/payload-types'
import { HeroBlock } from './Hero/Component'

const components: Record<string, React.ComponentType<{ block: any }>> = {
  hero: HeroBlock,
  // additional blocks registered in Phase 6 final wiring
}

export function RenderBlocks({ blocks }: { blocks: PageBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = components[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return <Component key={i} block={block} />
      })}
    </>
  )
}
