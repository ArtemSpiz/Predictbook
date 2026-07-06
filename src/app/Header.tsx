import Image from 'next/image'
import Tg from '../../public/tg.png'
import X from '../../public/x.png'
import Down from '../../public/down.png'
import Burger from '../../public/menu.png'
import { InfiniteScroll } from './InfiniteScroll'

const Icons = [
  {
    icon: Tg,
    href: '',
  },
  {
    icon: X,
    href: '',
  },
]

const MenuItems = [
  {
    label: 'Home',
    link: '',
  },
  {
    label: 'Analysis',
    links: [
      { text: 'All analysis', link: '' },
      { text: 'Sports', link: '' },
      { text: 'Politics', link: '' },
      { text: 'Finance', link: '' },
      { text: 'Crypto', link: '' },
    ],
  },
  {
    label: 'Signals',
    link: '',
  },
  {
    label: 'Live Feed',
    link: '',
  },
]

export async function Header() {
  const active = 0
  return (
    <>
      <InfiniteScroll />
      <header className="container-custom">
        <div className="border-[#E1DDD5]    md:border-r-1 md:border-l-1">
          <div className=" mx-auto md:px-6 py-3 flex items-center justify-between border-b border-[#E1DDD5]">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 lg:hidden">
                <Image src={Burger} alt="" />
              </div>
              <div className="font-bold text-3xl max-lg:text-2xl max-md:text-xl ">
                Predictbook
              </div>{' '}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 max-lg:hidden">
                {Icons.map((icon, i) => (
                  <a
                    href={icon.href}
                    target="_black"
                    rel="noopener noreferrer"
                    key={i}
                    className="w-8 h-8"
                  >
                    <Image src={icon.icon} alt={icon.href} />
                  </a>
                ))}
              </div>

              <button className="bg-[#221E1D] border-none text-[#F7F4F2] py-3 px-4 rounded-lg text-base">
                Real-time alerts
              </button>
            </div>
          </div>
          <div className="mx-auto md:px-6 max-xl:px-2 flex items-center justify-between  border-b border-[#E1DDD5]">
            <div className="flex max-lg:hidden">
              {MenuItems.map((item, i) => (
                <div key={item.label} className="relative group  border-r border-[#E1DDD5]">
                  <a
                    href={item.link}
                    className="flex items-center gap-2 p-4 max-xl:p-3 hover:bg-[#F2ECE6] group-hover:bg-[#F2ECE6]"
                  >
                    <span className={`text-sm ${active === i ? 'font-bold' : 'font-normal'}`}>
                      {item.label}
                    </span>

                    {item.links && (
                      <Image
                        src={Down}
                        alt=""
                        className="w-3 transition-transform group-hover:-rotate-180"
                      />
                    )}
                  </a>

                  {item.links && (
                    <div className="absolute left-0 mx-auto top-full hidden group-hover:block bg-[#F2ECE6] min-w-[105px] z-20 ">
                      {item.links.map((link) => (
                        <a
                          key={link.text}
                          href={link.link}
                          className="block p-4 text-sm text-center  border-t border-[#F7F4F2] hover:bg-[#E8E1DA]"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 max-lg:w-full max-lg:justify-between max-lg:py-3 max-lg:px-5 max-md:px-0">
              <div className="text-[#5D554F] text-sm">Tuesday, June 23 · 2026</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full p-0.5  bg-[#357B463D] ">
                  <div className="w-1 h-1 rounded-full bg-[#357B46]" />
                </div>
                <div className="text-[#357B46] text-sm">8 signals today</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
