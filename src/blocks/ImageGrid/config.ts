import type { Block } from 'payload'

export const ImageGrid: Block = {
  slug: 'image-grid',
  imageURL: '/blocks/image-grid.png',
  imageAltText: 'Image gallery in 2/3/4/6 columns',
  admin: { group: 'Lists & Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '6', value: '6' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
