import { FAQClient } from './Component.client'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'faq' }>

export function FAQBlock({ block }: { block: Block }) {
  return <FAQClient block={block} />
}
