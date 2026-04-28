import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  fields: [{ name: 'title', type: 'text', required: true }],
}
