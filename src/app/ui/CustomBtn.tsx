import Image from 'next/image'
import Link from 'next/link'
import Arrow from '../../../public/BtnArrow.png'

interface CustomBtnProps {
  text: string
  center?: boolean
  light?: boolean
  icon?: boolean
  href?: string
}

export default function CustomBtn({
  text,
  center = false,
  light = false,
  icon = true,
  href,
}: CustomBtnProps) {
  const className = `group w-full border-none flex items-center gap-2 px-3 py-2.5 rounded-lg ${
    center ? 'justify-center' : 'justify-between'
  } ${light ? 'bg-cream ' : 'bg-sand'}`

  const inner = (
    <>
      <span>{text}</span>
      {icon && (
        <Image
          src={Arrow}
          alt="Arrow"
          className="w-4 h-4 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 ease-out"
        />
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" className={className}>
      {inner}
    </button>
  )
}
