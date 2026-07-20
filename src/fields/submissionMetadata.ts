import type { Field } from 'payload'

/** Readonly metadata captured automatically on public form submissions. */
export const submissionMetadataField: Field = {
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
}
