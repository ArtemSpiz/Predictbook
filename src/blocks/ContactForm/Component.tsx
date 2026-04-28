import { ContactFormClient } from './Component.client'
import type { PageBlock } from '@/payload-types'

type Block = Extract<PageBlock, { blockType: 'contact-form-block' }>

export function ContactFormBlockComponent({ block }: { block: Block }) {
  if (typeof block.form !== 'object' || !block.form) return null
  return <ContactFormClient block={block} />
}
