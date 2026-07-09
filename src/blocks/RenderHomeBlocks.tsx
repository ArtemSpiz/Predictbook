import { Fragment } from 'react'
import { planRegion } from './homeBlocks'
import Signals from '@/app/components/Home/Signals'
import { SignalFeedBlockComponent } from './SignalFeed/Component'
import { CategorySections } from './CategorySection/CategorySections'
import { regionBlockComponents } from './regionBlockComponents'
import type { HomePage } from '@/payload-types'

const Divider = () => <div className="w-full h-px bg-line" />

function SingleBlock({ block }: { block: { blockType: string } }) {
  const Component = regionBlockComponents[block.blockType]
  return Component ? <Component block={block} /> : null
}

type SidebarBlock = NonNullable<HomePage['sidebarBlocks']>[number]
type MainBlock = NonNullable<HomePage['mainBlocks']>[number]
type Header = { title: string; subtitle?: string | null }

// Runtime guarantee: planRegion groups only blocks whose blockType matches.
type Extract2<U, T> = U extends { blockType: T } ? U : never

export function SidebarRegion({
  blocks,
  signalsHeader,
}: {
  blocks: SidebarBlock[] | null | undefined
  signalsHeader: Header
}) {
  const segments = planRegion(blocks, 'signal-feed')
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {seg.kind === 'group' ? (
            <Signals header={signalsHeader}>
              {seg.blocks.map((b, j) => (
                <Fragment key={j}>
                  {j > 0 && <Divider />}
                  <SignalFeedBlockComponent block={b as Extract2<SidebarBlock, 'signal-feed'>} />
                </Fragment>
              ))}
            </Signals>
          ) : (
            <SingleBlock block={seg.block} />
          )}
        </Fragment>
      ))}
    </>
  )
}

export function MainRegion({
  blocks,
  categoryHeader,
}: {
  blocks: MainBlock[] | null | undefined
  categoryHeader: Header
}) {
  const segments = planRegion(blocks, 'category-section')
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {seg.kind === 'group' ? (
            <CategorySections
              blocks={seg.blocks as Extract2<MainBlock, 'category-section'>[]}
              header={categoryHeader}
            />
          ) : (
            <SingleBlock block={seg.block} />
          )}
        </Fragment>
      ))}
    </>
  )
}
