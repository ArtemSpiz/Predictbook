import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contact-form-block',
  imageURL: '/blocks/contact-form-block.png',
  imageAltText: 'Contact form (uses plugin-form-builder)',
  admin: { group: 'Forms' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
