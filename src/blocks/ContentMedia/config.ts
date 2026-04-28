import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const ContentMedia: Block = {
  slug: 'content-media',
  imageURL: '/blocks/content-media.png',
  imageAltText: 'Multiple alternating media+text sections',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText', editor: wideMarkupLexical },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
