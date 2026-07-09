import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const SignalsPage: GlobalConfig = {
  slug: 'signals-page',
  label: 'Signals Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Signals' },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Hand-picked prediction market opportunities — up to 5 per day, curated from our live alerts system. Arbitrage spreads, whale moves, and value plays.',
    },
    { name: 'delayText', type: 'text', defaultValue: '10-min delay' },
  ],
}
