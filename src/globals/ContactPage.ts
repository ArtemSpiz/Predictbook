import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { ContactFormFieldsBlock } from '@/blocks/ContactFormFields/config'
import { ContactMethodsBlock } from '@/blocks/ContactMethods/config'
import { ContactValueBlock } from '@/blocks/ContactValue/config'
import { seoTab } from '@/fields/seoMeta'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: { group: 'Pages' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main content',
          fields: [
            {
              name: 'mainBlocks',
              type: 'blocks',
              labels: { singular: 'Main block', plural: 'Main blocks' },
              blocks: [ContactFormFieldsBlock],
            },
          ],
        },
        {
          label: 'Right sidebar',
          fields: [
            {
              name: 'sidebarBlocks',
              type: 'blocks',
              labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
              blocks: [ContactMethodsBlock, ContactValueBlock],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
