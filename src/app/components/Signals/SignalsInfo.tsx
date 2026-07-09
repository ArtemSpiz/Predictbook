import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Time from '../../../../public/time.png'
import Image from 'next/image'
import SignalsCard from './SignalsCard'
import type { SignalView } from '@/app/lib/viewModels'

interface Props {
  title: string
  subtitle?: string
  delayText?: string
  count: number
  items: SignalView[]
}

export default function SignalsInfo({ title, subtitle, delayText, count, items }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <Breadcrumbs items={[{ label: title }]} />
      <BlockTitle title={title} subtitle={subtitle} />

      <div className="w-full h-px bg-line " />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5  bg-success-a24 ">
            <div className="w-1 h-1 rounded-full bg-success" />
          </div>
          <div className="text-success text-sm">{count} signals today</div>
        </div>

        <div className="flex items-center gap-1">
          <Image src={Time} alt="" className="w-3 h-3" />
          <div className="text-xs">{delayText}</div>
        </div>
      </div>

      <div className="w-full h-px bg-line " />

      <SignalsCard cards={items} />
    </div>
  )
}
