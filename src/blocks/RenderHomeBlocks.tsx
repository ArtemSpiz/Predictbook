import { Fragment } from 'react'
import { planRegion } from './homeBlocks'
import Signals from '@/app/components/Home/Signals'
import { SignalFeedBlockComponent } from './SignalFeed/Component'
import { SummaryBlockComponent } from './Summary/Component'
import { RealCardBlockComponent } from './RealCard/Component'
import { AnalysisBlockComponent } from './Analysis/Component'
import { LiveFeedBlockComponent } from './LiveFeedBlock/Component'
import { CategorySections } from './CategorySection/CategorySections'
import type { HomePage } from '@/payload-types'

const Divider = () => <div className="w-full h-px bg-line" />

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
          ) : seg.block.blockType === 'summary' ? (
            <SummaryBlockComponent
              block={seg.block as unknown as Parameters<typeof SummaryBlockComponent>[0]['block']}
            />
          ) : seg.block.blockType === 'real-card' ? (
            <RealCardBlockComponent block={seg.block} />
          ) : null}
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
          ) : seg.block.blockType === 'analysis' ? (
            <AnalysisBlockComponent block={seg.block} />
          ) : seg.block.blockType === 'live-feed-block' ? (
            <LiveFeedBlockComponent block={seg.block} />
          ) : null}
        </Fragment>
      ))}
    </>
  )
}
