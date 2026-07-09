import { RichText } from '@payloadcms/richtext-lexical/react'
import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import AboutCTA from './AboutCTA'
import type { AboutPage } from '@/payload-types'

export default function AboutMain({ content }: { content?: AboutPage | null }) {
  const title = content?.title ?? 'About Predictbook'
  return (
    <div className="flex flex-col gap-6 flex-1 ">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: title }]} />
        <BlockTitle title={title} />
        {content?.body && (
          <div className="prose text-sm text-muted max-w-none">
            <RichText data={content.body} />
          </div>
        )}
        <AboutCTA cta={content?.cta} />
      </div>
    </div>
  )
}
