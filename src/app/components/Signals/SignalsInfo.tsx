import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import Time from '../../../../public/time.png'
import Image from 'next/image'
import SignalsCard from './SignalsCard'

export default function SignalsInfo() {
  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-[#E1DDD5] md:p-5">
      <Breadcrumbs items={[{ label: 'Signals' }]} />
      <BlockTitle
        title="Signals"
        subtitle="Hand-picked prediction market opportunities — up to 5 per day, curated from our live alerts system. Arbitrage spreads, whale moves, and value plays."
      />

      <div className="w-full h-px bg-[#E1DDD5] " />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5  bg-[#357B463D] ">
            <div className="w-1 h-1 rounded-full bg-[#357B46]" />
          </div>
          <div className="text-[#357B46] text-sm">8 signals today</div>
        </div>

        <div className="flex items-center gap-1">
          <Image src={Time} alt="" className="w-3 h-3" />
          <div className="text-xs">10-min delay</div>
        </div>
      </div>

      <div className="w-full h-px bg-[#E1DDD5] " />

      <SignalsCard />
    </div>
  )
}
