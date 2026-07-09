import Image from 'next/image'
import Lightning from '../../../../public/Lightning.png'
import Graph from '../../../../public/Graph.png'
import CustomBtn from '@/app/ui/CustomBtn'

export default async function RealCard() {
  return (
    <div className="relative bg-ink p-6 flex flex-col gap-4">
      <div className="flex gap-3 relative items-center">
        <div className=" bg-ink-2 p-2 relative rounded">
          <Image src={Lightning} alt="" className="w-4 h-4" />
          <div className="w-2 h-2 rounded-full  -top-0.5 -right-0.5 p-0.5 absolute  bg-live-a24 ">
            <div className="w-1 h-1 rounded-full bg-live" />
          </div>
        </div>

        <div className="flex items-center gap-1 ">
          <div className="text-white-a80 text-xs font-medium">Real-time alerts</div>
        </div>
      </div>

      <div>
        {' '}
        <div className="text-white font-medium text-2xl mb-2 md:max-w-[150px]">
          Want signals in real time?
        </div>
        <div className="text-cream text-sm">
          Get instant alerts with advanced filtering tailored to your interests.
        </div>
      </div>

      <CustomBtn text="Join Real-time Alerts" />

      <div className="max-w-[155px] h-auto absolute top-[40%] -translate-y-1/2 right-0">
        <Image src={Graph} alt="" />
      </div>
    </div>
  )
}
