import type { CheckboxField } from 'payload'

export const hiddenField: CheckboxField = {
  name: 'hidden',
  type: 'checkbox',
  label: 'Hide on site',
  defaultValue: false,
  admin: { description: 'Temporarily hide this block without deleting it.' },
}
