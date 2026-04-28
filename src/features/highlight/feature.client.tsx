'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { HighlightNode, $createHighlightNode, $isHighlightNode } from './components/HighlightNode'
import { $getSelection, $isRangeSelection } from 'lexical'
import type { ToolbarGroup } from '@payloadcms/richtext-lexical'

const toolbarGroup: ToolbarGroup = {
  type: 'buttons',
  key: 'highlight',
  items: [
    {
      ChildComponent: () => (
        <span style={{ background: 'yellow', padding: '0 4px' }}>H</span>
      ),
      key: 'highlight',
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return
          const text = selection.getTextContent()
          if (!text) return
          const node = $createHighlightNode(text)
          selection.insertNodes([node])
        })
      },
    },
  ],
}

export const HighlightFeatureClient = createClientFeature({
  nodes: [HighlightNode],
  toolbarFixed: { groups: [toolbarGroup] },
  toolbarInline: { groups: [toolbarGroup] },
})

export { $createHighlightNode, $isHighlightNode }
