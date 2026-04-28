/* eslint-disable @typescript-eslint/no-explicit-any */
import starterConfig from '../../starter.config'
import type { PageBlock } from '@/payload-types'
import { HeroBlock } from './Hero/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { RichTextBlockComponent } from './RichTextBlock/Component'
import { MediaWithTextBlock } from './MediaWithText/Component'
import { ContentMediaBlock } from './ContentMedia/Component'
import { TextColumnsBlock } from './TextColumns/Component'
import { FeatureGridBlock } from './FeatureGrid/Component'
import { ImageGridBlock } from './ImageGrid/Component'
import { LogoCloudBlock } from './LogoCloud/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { FAQBlock } from './FAQ/Component'
import { StatsBlock } from './Stats/Component'
import { StatsChartBlock } from './StatsChart/Component'
import { ContactFormBlockComponent } from './ContactForm/Component'

const baseComponents: Record<string, React.ComponentType<{ block: any }>> = {
  hero: HeroBlock,
  'call-to-action': CallToActionBlock,
  'rich-text-block': RichTextBlockComponent,
  'media-with-text': MediaWithTextBlock,
  'content-media': ContentMediaBlock,
  'text-columns': TextColumnsBlock,
  'feature-grid': FeatureGridBlock,
  'image-grid': ImageGridBlock,
  'logo-cloud': LogoCloudBlock,
  faq: FAQBlock,
  stats: StatsBlock,
}

const components: Record<string, React.ComponentType<{ block: any }>> = {
  ...baseComponents,
  ...(starterConfig.features.swiper ? { testimonials: TestimonialsBlock } : {}),
  ...(starterConfig.features.charts ? { 'stats-chart': StatsChartBlock } : {}),
  ...(starterConfig.features.formBuilder
    ? { 'contact-form-block': ContactFormBlockComponent }
    : {}),
}

export function RenderBlocks({ blocks }: { blocks: PageBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = components[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return <Component key={i} block={block} />
      })}
    </>
  )
}
