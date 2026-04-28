import type { Block } from 'payload'

export const LogoCloud: Block = {
  slug: 'logo-cloud',
  imageURL: '/blocks/logo-cloud.png',
  imageAltText: 'Partner / client logos',
  admin: { group: 'Lists & Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text' },
      ],
    },
  ],
}
