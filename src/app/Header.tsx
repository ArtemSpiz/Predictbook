'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    link: '/',
  },
  {
    label: 'Analysis',
    links: [
      { text: 'All analysis', link: '/blog' },
      { text: 'Sports', link: '/blog/category/sports' },
      { text: 'Politics', link: '/blog/category/politics' },
      { text: 'Economics', link: '/blog/category/economics' },
      { text: 'Crypto', link: '/blog/category/crypto' },
    ],
  },
  {
    label: 'Signals',
    link: '/signals',
  },
  {
    label: 'Live Feed',
    link: '/live-feed',
  },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)

  const isActive = (item: (typeof MenuItems)[number]) => {
    if (item.label === 'Analysis') {
      return pathname.startsWith('/blog')
    }
    return pathname === item.link
  }

  return (
    <>
      <InfiniteScroll />
      <header className="md:container-custom">
        <div className="border-[#E1DDD5]  md:border-r md:border-l">
          <div className=" mx-auto md:px-6 py-3 flex items-center justify-between border-b border-[#E1DDD5] max-md:px-5">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden bg-transparent border-none"
              >
                <Image src={Burger} alt="Menu" className="w-6 h-6" />
              </button>
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
          <div className="mx-auto md:pr-6 max-xl:pr-2 flex items-center justify-between  border-b border-[#E1DDD5] max-md:px-5">
            <div className="flex max-lg:hidden">
              {MenuItems.map((item, i) => (
                <div key={item.label} className="relative group  border-r border-[#E1DDD5]">
                  <a
                    href={item.link}
                    className="flex items-center gap-2 p-4 max-xl:p-3 hover:bg-[#F2ECE6] group-hover:bg-[#F2ECE6]"
                  >
                    <span className={`text-sm ${isActive(item) ? 'font-bold' : 'font-normal'}`}>
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

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[320px] bg-[#F7F4F2] shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E1DDD5] p-6">
          <h2 className="text-xl font-semibold">Menu</h2>

          <button onClick={() => setIsOpen(false)} className="text-3xl bg-transparent leading-none">
            ×
          </button>
        </div>

        <div className="py-2">
          {MenuItems.map((item) => (
            <div key={item.label}>
              {!item.links ? (
                <Link
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`block border-b border-[#E1DDD5] px-6 py-5 text-lg ${
                    isActive(item) ? 'font-bold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <a
                    onClick={() => setAnalysisOpen(!analysisOpen)}
                    className="flex w-full bg-transparent items-center justify-between border-b border-[#E1DDD5] px-6 py-5 text-lg"
                  >
                    <span className={isActive(item) ? 'font-bold' : ''}>{item.label}</span>

                    <Image
                      src={Down}
                      alt=""
                      className={`w-3 transition-transform ${analysisOpen ? 'rotate-180' : ''}`}
                    />
                  </a>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      analysisOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.text}
                        href={link.link}
                        onClick={() => setIsOpen(false)}
                        className="block bg-[#EFE8E1] px-10 py-4 text-[#5D554F]"
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className=" p-6">
          <button className="w-full rounded-lg bg-[#221E1D] py-3 text-white">
            Real-time alerts
          </button>

          <div className="mt-6 items-center justify-center flex gap-4">
            {Icons.map((icon, i) => (
              <a
                key={i}
                href={icon.href}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow"
              >
                <Image src={icon.icon} alt="" className="w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
