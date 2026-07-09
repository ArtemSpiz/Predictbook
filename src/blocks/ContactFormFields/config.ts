import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const ContactFormFieldsBlock: Block = {
  slug: 'contact-form-fields',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Contact Us' },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        "Have a question, feedback, or partnership inquiry? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.",
    },
    {
      name: 'subjectOptions',
      type: 'array',
      label: 'Subject options',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    { name: 'nameLabel', type: 'text', defaultValue: 'Full name' },
    { name: 'emailLabel', type: 'text', defaultValue: 'Email address' },
    { name: 'subjectLabel', type: 'text', defaultValue: 'Subject' },
    { name: 'messageLabel', type: 'text', defaultValue: 'Message' },
    { name: 'buttonText', type: 'text', defaultValue: 'Send message' },
    hiddenField,
  ],
}
