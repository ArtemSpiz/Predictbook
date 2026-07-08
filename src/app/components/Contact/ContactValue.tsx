import Image from 'next/image'
import BtnArrow from '@/../public/BtnArrow.png'
import CustomBtn from '@/app/ui/CustomBtn'

export default function ContactValue() {
  return (
    <div className="border border-[#E1DDD5] p-6 flex flex-col gap-4">
      <div className="font-medium">Other ways to reach us</div>
      <div className="text-sm text-[#5D554F]">
        Your input helps us improve Predictbook and deliver better analysis.
      </div>
      <CustomBtn text="Suggest a topic" center />
    </div>
  )
}
