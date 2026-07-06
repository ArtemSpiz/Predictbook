import { createServerFeature } from '@payloadcms/richtext-lexical'
import { HighlightNode } from '@/features/highlight/components/HighlightNode'

export const HighlightFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/highlight/feature.client#HighlightFeatureClient',
    nodes: [
      {
        node: HighlightNode,
      },
    ],
  },
  key: 'highlight',
})
