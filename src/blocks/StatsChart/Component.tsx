import { StatsChartClient } from './Component.client'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'stats-chart' }>

export function StatsChartBlock({ block }: { block: Block }) {
  return <StatsChartClient block={block} />
}
