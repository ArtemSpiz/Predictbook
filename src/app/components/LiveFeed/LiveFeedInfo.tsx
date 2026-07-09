import { Breadcrumbs } from '@/app/ui/Breadcrumbs'

interface Props {
  title: string
  subtitle?: string | null
}

export default function LiveFeedInfo({ title, subtitle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs items={[{ label: title }]} />
      <div className="font-semibold text-live flex items-center gap-1 text-2xl max-md:text-lg">
        <div className="w-2 h-2 rounded-full p-0.5  bg-live-a24 ">
          <div className="w-1 h-1 rounded-full bg-live" />
        </div>
        {title}
      </div>
      <div className="text-sm text-muted">{subtitle}</div>
    </div>
  )
}
