/* eslint-disable @typescript-eslint/no-explicit-any */
import { SummaryBlockComponent } from './Summary/Component'
import { RealCardBlockComponent } from './RealCard/Component'
import { SponsoredCardBlockComponent } from './SponsoredCard/Component'
import { AnalysisBlockComponent } from './Analysis/Component'
import { LiveFeedBlockComponent } from './LiveFeedBlock/Component'
import { SignalsListBlockComponent } from './SignalsList/Component'
import { LiveFeedListBlockComponent } from './LiveFeedList/Component'
import { NewsListBlockComponent } from './NewsList/Component'
import { ContactFormFieldsBlockComponent } from './ContactFormFields/Component'
import { ContactMethodsBlockComponent } from './ContactMethods/Component'
import { ContactValueBlockComponent } from './ContactValue/Component'

// Single-block renderers shared by home and other pages. Grouped block types
// (signal-feed, category-section) are handled specially in RenderHomeBlocks and
// are intentionally NOT in this map.
export const regionBlockComponents: Record<string, React.ComponentType<{ block: any }>> = {
  summary: SummaryBlockComponent,
  'real-card': RealCardBlockComponent,
  'sponsored-card': SponsoredCardBlockComponent,
  analysis: AnalysisBlockComponent,
  'live-feed-block': LiveFeedBlockComponent,
  'signals-list': SignalsListBlockComponent,
  'live-feed-list': LiveFeedListBlockComponent,
  'news-list': NewsListBlockComponent,
  'contact-form-fields': ContactFormFieldsBlockComponent,
  'contact-methods': ContactMethodsBlockComponent,
  'contact-value': ContactValueBlockComponent,
}
