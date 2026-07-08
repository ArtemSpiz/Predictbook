import CTAbg from '@/../public/CTAbg.png'
import CustomBtn from '@/app/ui/CustomBtn'
import Image from 'next/image'

export default function AboutCTA() {
  return (
    <div className="flex relative items-center justify-center text-center flex-col p-6 gap-4 bg-[#221E1D]">
      <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 right-0 w-full h-full">
        <Image src={CTAbg} alt="" />
      </div>

      <div>
        <div className="text-white text-2xl max-md:text-lg">Stay in the loop</div>
        <div className="text-white text-sm max-w-[440px] mx-auto">
          Never miss the latest market analysis, prediction insights, and emerging opportunities.
          Delivered straight to your inbox.
        </div>
      </div>

      <div className="flex self-stretch gap-2 mx-auto">
        <input
          placeholder="Your email"
          className="bg-[#FFFFFF3D] md:min-w-[230px] focus:outline-none p-2.5 border border-[#E8DFD852] rounded-lg placeholder:text-[#FFFFFF8F] text-white backdrop-blur-sm"
        />
        <div className='w-max'>
          <CustomBtn text="Subscribe" icon={false} />
        </div>
      </div>
    </div>
  )
}
