import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const MediaWithText: Block = {
  slug: 'media-with-text',
  imageURL: '/blocks/media-with-text.png',
  imageAltText: 'Media + text, left or right',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'image' },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'video' },
        },
      ],
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
