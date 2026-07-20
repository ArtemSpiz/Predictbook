import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { submissionMetadataField } from '@/fields/submissionMetadata'

export const NewsletterSubmissions: CollectionConfig = {
  slug: 'newsletter-submissions',
  labels: { singular: 'Newsletter Signup', plural: 'Newsletter Signups' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'country', 'createdAt'] },
  access: {
    // Created only via the server route (overrideAccess); never publicly listable.
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  timestamps: true,
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    submissionMetadataField,
  ],
}
