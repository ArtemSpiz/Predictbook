import Image from 'next/image'
import Arrow from '../../../public/BtnArrow.png'

interface AllBtnProps {
  text: string
}

export default function AllBtn({ text }: AllBtnProps) {
  return (
    <a className={`group flex gap-1 text-sm items-center text-nowrap`}>
      <span>{text}</span>
      <Image
        src={Arrow}
        alt="Arrow"
        className="w-4 h-4 relative 
        group-hover:translate-x-0.5 group-hover:-translate-y-0.5
        transition-all duration-300 ease-out"
      />
    </a>
  )
}
