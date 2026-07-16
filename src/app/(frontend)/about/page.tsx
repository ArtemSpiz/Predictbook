import type { Metadata } from 'next'
import AboutMain from '@/app/components/About/AboutMain'
import { RenderBlockList } from '@/blocks/RenderBlockList'
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
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <AboutMain content={content} />
        </div>
        <div className="w-full h-px bg-line md:hidden" />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </div>
    </main>
  )
}
