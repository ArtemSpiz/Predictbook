import { FAQClient } from './Component.client'
import type { PageBlock } from '@/blocks/types'
import { jsonLdScriptContent } from '@/utilities/structuredData'

type Block = Extract<PageBlock, { blockType: 'faq' }>

/** Recursively collect text nodes from a Lexical serialized state into plain text. */
function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (typeof n.text === 'string') return n.text
  const children = n.root ? [n.root] : n.children
  if (Array.isArray(children)) return children.map(lexicalToText).join(' ')
  return ''
}

export function FAQBlock({ block }: { block: Block }) {
  const items = (block.items ?? []) as { question: string; answer: unknown }[]
  const faqSchema =
    items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: lexicalToText(item.answer).trim(),
            },
          })),
        }
      : null

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(faqSchema) }}
        />
      )}
      <FAQClient block={block} />
    </>
  )
}
