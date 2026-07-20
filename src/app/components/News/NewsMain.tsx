import { RenderBlockList } from '@/blocks/RenderBlockList'
import { ContentLayout } from '@/app/ui/ContentLayout'
import { getNewsPageContent } from '@/utilities/getPageContent'

export default async function NewsMain() {
  const content = await getNewsPageContent()

  return (
    <div className="container-custom">
      <ContentLayout>
        <div className="flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <RenderBlockList blocks={content?.mainBlocks} />
        </div>

        <div className="flex flex-col gap-4 lg:max-w-[300px] lg:w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </ContentLayout>
    </div>
  )
}
