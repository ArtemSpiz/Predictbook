import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Contact Us' },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        "Have a question, feedback, or partnership inquiry? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.",
    },
    {
      name: 'methods',
      type: 'array',
      label: 'Contact methods',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'linkText', type: 'text', required: true },
        { name: 'link', type: 'text' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social links',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text', required: true },
      ],
    },
    {
      name: 'valueCard',
      type: 'group',
      label: 'Suggest a topic card',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Other ways to reach us' },
        {
          name: 'text',
          type: 'textarea',
          defaultValue:
            'Your input helps us improve Predictbook and deliver better analysis.',
        },
        { name: 'buttonText', type: 'text', defaultValue: 'Suggest a topic' },
      ],
    },
  ],
}
