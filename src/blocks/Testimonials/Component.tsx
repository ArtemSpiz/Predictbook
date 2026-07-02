import { TestimonialsClient } from './Component.client'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'testimonials' }>

export function TestimonialsBlock({ block }: { block: Block }) {
  return <TestimonialsClient block={block} />
}
