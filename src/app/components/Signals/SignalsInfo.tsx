import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Time from '../../../../public/time.png'
import Image from 'next/image'
import SignalsCard from './SignalsCard'
import type { SignalView } from '@/app/lib/viewModels'
import type { SignalsPage } from '@/payload-types'

interface Props {
  signals: SignalView[]
  content?: SignalsPage | null
}

export default function SignalsInfo({ signals, content }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <Breadcrumbs items={[{ label: content?.title ?? 'Signals' }]} />
      <BlockTitle
        title={content?.title ?? 'Signals'}
        subtitle={
          content?.subtitle ??
          'Hand-picked prediction market opportunities — up to 5 per day, curated from our live alerts system. Arbitrage spreads, whale moves, and value plays.'
        }
      />

      <div className="w-full h-px bg-line " />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5  bg-success-a24 ">
            <div className="w-1 h-1 rounded-full bg-success" />
          </div>
          <div className="text-success text-sm">{signals.length} signals today</div>
        </div>

        <div className="flex items-center gap-1">
          <Image src={Time} alt="" className="w-3 h-3" />
          <div className="text-xs">{content?.delayText ?? '10-min delay'}</div>
        </div>
      </div>

      <div className="w-full h-px bg-line " />

      <SignalsCard cards={signals} />
    </div>
  )
}
