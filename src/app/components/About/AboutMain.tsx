import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import AboutCTA from './AboutCTA'

export default function AboutMain() {
  return (
    <div className="flex flex-col gap-6 flex-1 ">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: 'About Predictbook' }]} />
        <BlockTitle title="About Predictbook" />
        {/* rich text */}
        <AboutCTA />
      </div>
    </div>
  )
}
