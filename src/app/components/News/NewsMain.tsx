import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getNewsPageContent } from '@/utilities/getPageContent'

export default async function NewsMain() {
  const content = await getNewsPageContent()

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <RenderBlockList blocks={content?.mainBlocks} />
        </div>

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </div>
    </div>
  )
}
