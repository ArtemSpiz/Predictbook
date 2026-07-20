import { SidebarRegion, MainRegion } from '@/blocks/RenderHomeBlocks'
import { ContentLayout } from '@/app/ui/ContentLayout'
import { getHomePageContent } from '@/utilities/getPageContent'

export default async function Main() {
  const content = await getHomePageContent()

  const signalsHeader = content?.signalsMobileHeader ?? { title: 'Signals' }
  const categoryHeader = content?.categorySwitcherHeader ?? { title: 'Explore by Category' }

  return (
    <div className="container-custom">
      <ContentLayout>
        <div className="flex flex-col gap-5 w-full lg:max-w-[300px]">
          <SidebarRegion blocks={content?.sidebarBlocks} signalsHeader={signalsHeader} />
        </div>

        <div className="md:border-l border-line flex flex-col gap-5 md:pl-5 flex-1">
          <MainRegion blocks={content?.mainBlocks} categoryHeader={categoryHeader} />
        </div>
      </ContentLayout>
    </div>
  )
}
