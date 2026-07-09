import { SidebarRegion, MainRegion } from '@/blocks/RenderHomeBlocks'
import { getHomePageContent } from '@/utilities/getPageContent'

export default async function Main() {
  const content = await getHomePageContent()

  const signalsHeader = content?.signalsMobileHeader ?? { title: 'Signals' }
  const categoryHeader = content?.categorySwitcherHeader ?? { title: 'Explore by Category' }

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5 w-full md:max-w-[300px]">
          <SidebarRegion blocks={content?.sidebarBlocks} signalsHeader={signalsHeader} />
        </div>

        <div className="md:border-l border-line flex flex-col gap-5 md:pl-5 flex-1">
          <MainRegion blocks={content?.mainBlocks} categoryHeader={categoryHeader} />
        </div>
      </div>
    </div>
  )
}
