import Image from 'next/image'
import Arrow from '../../../public/BtnArrow.png'

interface CustomBtnProps {
  text: string
  center?: boolean
  light?: boolean
  icon?: boolean
}

export default function CustomBtn({
  text,
  center = false,
  light = false,
  icon = true,
}: CustomBtnProps) {
  return (
    <button
      className={`bg-[#E8DFD8] group w-full border-none flex items-center gap-2 px-3 py-2.5 rounded-lg ${
        center ? 'justify-center' : 'justify-between'
      } ${light ? 'bg-[#F4F0ED]' : 'bg-[#E8DFD8]'}`}
    >
      <span>{text}</span>

      {icon && (
        <Image
          src={Arrow}
          alt="Arrow"
          className="w-4 h-4 relative 
        group-hover:translate-x-0.5 group-hover:-translate-y-0.5
        transition-all duration-500 ease-out"
        />
      )}
    </button>
  )
}
