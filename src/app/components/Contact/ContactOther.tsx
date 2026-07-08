import Locked from '@/../public/Locked.png'
import ContactEmail from '@/../public/ContactEmail.png'
import ContactTg from '@/../public/ContactTg.png'
import ContactAdvert from '@/../public/ContactAdvert.png'
import Timer from '@/../public/Timer.png'
import Image from 'next/image'
import BtnArrow from '@/../public/BtnArrow.png'
import Tg from '@/../public/tg.png'
import X from '@/../public/x.png'

const ContactOtherContent = [
  {
    icon: ContactEmail,
    title: 'Email',
    linkText: 'hello@predictbook.io',
    link: '',
  },
  {
    icon: ContactTg,
    title: 'Telegram',
    linkText: '@predictbook',
    link: '',
  },
  {
    icon: ContactAdvert,
    title: 'Advertising & partnerships',
    linkText: 'partnerships@predictbook.io',
    link: '',
  },
]

const Links = [
  {
    icon: Tg,
    link: '',
  },
  {
    icon: X,
    link: '',
  },
]

export default function ContactOther() {
  return (
    <div className="bg-[#E8DFD8] border-[#E1DDD5] p-6 flex flex-col gap-4">
      <div className="font-medium">Other ways to reach us</div>

      <div className="flex flex-col gap-4">
        {ContactOtherContent.map((card, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8">
              <Image src={card.icon} alt="" />
            </div>

            <div>
              <div className="text-[#5D554F] text-sm">{card.title}</div>
              <a className="text-sm cursor-pointer flex items-center">
                <span className="underline">{card.linkText}</span>
                <Image src={BtnArrow} alt="" className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#5D554F29] pt-4 flex items-center justify-between">
        <div className="font-medium">Follow Us</div>

        <div className="flex items-center gap-3">
          {Links.map((item, i) => (
            <div className="w-8 h-8" key={i}>
              <Image src={item.icon} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
