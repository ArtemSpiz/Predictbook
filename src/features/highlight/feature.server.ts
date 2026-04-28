import { createServerFeature } from '@payloadcms/richtext-lexical'

export const HighlightFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/highlight/feature.client#HighlightFeatureClient',
    nodes: [
      {
        node: '@/features/highlight/components/HighlightNode#HighlightNode',
      },
    ],
  },
  key: 'highlight',
})
