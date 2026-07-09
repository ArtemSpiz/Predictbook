import { RenderBlockList } from '@/blocks/RenderBlockList'
import { getLiveFeedPageContent } from '@/utilities/getPageContent'

export default async function LiveFeedMain() {
  const content = await getLiveFeedPageContent()

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <RenderBlockList blocks={content?.mainBlocks} />

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </div>
    </div>
  )
}
