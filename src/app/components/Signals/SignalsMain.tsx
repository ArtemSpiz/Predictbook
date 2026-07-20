import { RenderBlockList } from '@/blocks/RenderBlockList'
import { ContentLayout } from '@/app/ui/ContentLayout'
import { getSignalsPageContent } from '@/utilities/getPageContent'

export default async function SignalsMain() {
  const content = await getSignalsPageContent()

  return (
    <div className="container-custom">
      <ContentLayout>
        <RenderBlockList blocks={content?.mainBlocks} />

        <div className="flex flex-col gap-4 lg:max-w-[300px]">
          <RenderBlockList blocks={content?.sidebarBlocks} />
        </div>
      </ContentLayout>
    </div>
  )
}
