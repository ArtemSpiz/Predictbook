import starterConfig from '../../../starter.config'
import { StatsClient } from './Component.client'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'stats' }>

export function StatsBlock({ block }: { block: Block }) {
  return <StatsClient block={block} useGsap={starterConfig.features.gsap} />
}
