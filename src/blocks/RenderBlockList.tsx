import { Fragment } from 'react'
import type { RenderableBlock } from './homeBlocks'
import { regionBlockComponents } from './regionBlockComponents'

const Divider = () => <div className="w-full h-px bg-line" />

/** Visible blocks in order (pure — unit tested). */
export function visibleBlocks<B extends RenderableBlock>(blocks: B[] | null | undefined): B[] {
  return (blocks ?? []).filter((b) => !b.hidden)
}

export function RenderBlockList({ blocks }: { blocks: RenderableBlock[] | null | undefined }) {
  const visible = visibleBlocks(blocks)
  return (
    <>
      {visible.map((block, i) => {
        const Component = regionBlockComponents[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return (
          <Fragment key={i}>
            {i > 0 && <Divider />}
            <Component block={block} />
          </Fragment>
        )
      })}
    </>
  )
}
