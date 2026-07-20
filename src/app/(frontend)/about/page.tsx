import type { Metadata } from 'next'
import AboutMain from '@/app/components/About/AboutMain'
import { RenderBlockList } from '@/blocks/RenderBlockList'
import { ContentLayout } from '@/app/ui/ContentLayout'
import { getAboutPageContent } from '@/utilities/getPageContent'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { resolvePageMeta } from '@/utilities/resolvePageMeta'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPageContent()
  return {
    ...(await resolvePageMeta(content?.meta, {
      title: content?.title ?? 'About Predictbook',
      url: '/about',
    })),
    ...localeAlternates('about'),
  }
}

export default async function About() {
  const content = await getAboutPageContent()
  return (
    <main className="container-custom">
      <ContentLayout>
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <AboutMain content={content} />
        </div>
        <div className="w-full h-px bg-line md:hidden" />
        <div className="flex flex-col gap-4 lg:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </ContentLayout>
    </main>
  )
}
