import CTAbg from '@/../public/CTAbg.png'
import CustomBtn from '@/app/ui/CustomBtn'
import Image from 'next/image'
import type { AboutPage } from '@/payload-types'

export default function AboutCTA({ cta }: { cta?: AboutPage['cta'] }) {
  return (
    <div className="flex relative items-center justify-center text-center flex-col p-6 gap-4 bg-ink">
      <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 right-0 w-full h-full">
        <Image src={CTAbg} alt="" />
      </div>

      <div>
        <div className="text-white text-2xl max-md:text-lg">{cta?.heading ?? 'Stay in the loop'}</div>
        <div className="text-white text-sm max-w-[440px] mx-auto">
          {cta?.text ??
            'Never miss the latest market analysis, prediction insights, and emerging opportunities. Delivered straight to your inbox.'}
        </div>
      </div>

      <div className="flex self-stretch gap-2 mx-auto">
        <input
          placeholder={cta?.placeholder ?? 'Your email'}
          className="bg-white-a24 md:min-w-[230px] focus:outline-none p-2.5 border border-sand-a32 rounded-lg placeholder:text-white-a56 text-white backdrop-blur-sm"
        />
        <div className="w-max">
          <CustomBtn text={cta?.buttonText ?? 'Subscribe'} icon={false} />
        </div>
      </div>
    </div>
  )
}
