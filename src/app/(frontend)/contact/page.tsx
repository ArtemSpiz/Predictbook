import type { Metadata } from 'next'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { ContentLayout } from '@/app/ui/ContentLayout'
import { getContactPageContent } from '@/utilities/getPageContent'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { resolvePageMeta } from '@/utilities/resolvePageMeta'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPageContent()
  const formBlock = content?.mainBlocks?.find((b) => b.blockType === 'contact-form-fields')
  return {
    ...(await resolvePageMeta(content?.meta, {
      title: formBlock?.heading ?? 'Contact Us',
      description: formBlock?.subtitle ?? undefined,
      url: '/contact',
    })),
    ...localeAlternates('contact'),
  }
}

export default async function Contact() {
  const content = await getContactPageContent()
  return (
    <main className="container-custom">
      <ContentLayout>
        <div className="flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <RenderBlockList blocks={content?.mainBlocks} />
        </div>
        <div className="flex flex-col gap-4 lg:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </ContentLayout>
    </main>
  )
}
