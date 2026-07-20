import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: { useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'email', 'createdAt'] },
  access: {
    // Created only via the server route (overrideAccess); never publicly listable.
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  timestamps: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      type: 'group',
      name: 'metadata',
      label: 'Submission metadata',
      admin: { readOnly: true, description: 'Captured automatically on submit.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'ipAddress', type: 'text', admin: { width: '33%' } },
            { name: 'country', type: 'text', admin: { width: '33%' } },
            { name: 'city', type: 'text', admin: { width: '34%' } },
          ],
        },
        { name: 'region', type: 'text' },
        { name: 'referrer', type: 'text', admin: { description: 'Referral source (document.referrer).' } },
        { name: 'landingUrl', type: 'text', admin: { description: 'Page the form was submitted from.' } },
        { name: 'userAgent', type: 'text' },
      ],
    },
  ],
}
