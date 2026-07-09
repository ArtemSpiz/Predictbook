import type { CollectionConfig } from 'payload'
import starterConfig from '../../../starter.config'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'
import { Hero } from '@/blocks/Hero/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { RichTextBlock } from '@/blocks/RichTextBlock/config'
import { MediaWithText } from '@/blocks/MediaWithText/config'
import { ContentMedia } from '@/blocks/ContentMedia/config'
import { TextColumns } from '@/blocks/TextColumns/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { ImageGrid } from '@/blocks/ImageGrid/config'
import { LogoCloud } from '@/blocks/LogoCloud/config'
import { Testimonials } from '@/blocks/Testimonials/config'
import { FAQ } from '@/blocks/FAQ/config'
import { Stats } from '@/blocks/Stats/config'
import { StatsChart } from '@/blocks/StatsChart/config'
import { ContactFormBlock } from '@/blocks/ContactForm/config'
import { pagesReadAccess, pagesWriteAccess } from './access'
import { SummaryBlock } from '@/blocks/Summary/config'
import { RealCardBlock } from '@/blocks/RealCard/config'

const allBlocks = [
  Hero,
  CallToAction,
  RichTextBlock,
  MediaWithText,
  ContentMedia,
  TextColumns,
  FeatureGrid,
  ImageGrid,
  LogoCloud,
  FAQ,
  Stats,
  SummaryBlock,
  RealCardBlock,
  ...(starterConfig.features.swiper ? [Testimonials] : []),
  ...(starterConfig.features.charts ? [StatsChart] : []),
  ...(starterConfig.features.formBuilder ? [ContactFormBlock] : []),
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: pagesReadAccess,
    create: pagesWriteAccess,
    update: pagesWriteAccess,
    delete: pagesWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: revalidateCollectionHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'blocks',
              type: 'blocks',
              minRows: 0,
              blocks: allBlocks,
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
