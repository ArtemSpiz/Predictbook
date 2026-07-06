'use client'
import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'faq' }>

interface Item {
  question: string
  answer: any
}

export function FAQClient({ block }: { block: Block }) {
  const items = (block.items ?? []) as Item[]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-8">{block.heading}</h2>
        )}
        <div className="divide-y border-y">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i}>
                <button
                  className="w-full text-left py-4 font-medium flex justify-between items-center"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="text-2xl">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="pb-4 prose prose-sm">
                    <RichText data={item.answer} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
