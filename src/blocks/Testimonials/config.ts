import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  imageURL: '/blocks/testimonials.png',
  imageAltText: 'Testimonial slider',
  admin: { group: 'Social Proof' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
