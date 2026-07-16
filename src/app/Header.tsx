'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Burger from '@/../public/menu.png'
import { InfiniteScroll } from './InfiniteScroll'
import { PayloadImage } from '@/app/components/PayloadImage'
import { SocialLinks, type SocialItem } from '@/app/ui/SocialLinks'
import { DesktopNav } from '@/app/components/Header/DesktopNav'
import { HeaderMeta } from '@/app/components/Header/HeaderMeta'
import { CtaButton } from '@/app/components/Header/CtaButton'
import { MobileMenu } from '@/app/components/Header/MobileMenu'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header as HeaderData, Ticker } from '@/payload-types'

type NavEntry = NonNullable<HeaderData['nav']>[number]

export function Header({
  data,
  social,
  signalsToday,
  ticker,
}: {
  data: HeaderData
  social: SocialItem[]
  signalsToday: number
  ticker: Ticker[]
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const nav = data.nav ?? []

  const isActive = (item: NavEntry) => {
    if ((item.children ?? []).length > 0) return pathname.startsWith('/analysis')
    return pathname === resolveLinkHref(item.link)
  }

  return (
    <>
      <InfiniteScroll items={ticker} />
      <header className="md:container-custom">
        <div className="border-line  md:border-r md:border-l">
          <div className=" mx-auto md:px-6 py-3 flex items-center justify-between border-b border-line max-md:px-5">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden bg-transparent border-none"
              >
                <Image src={Burger} alt="Menu" className="w-6 h-6" />
              </button>
              <Link href="/" className="font-bold text-3xl max-lg:text-2xl max-md:text-xl">
                {data.logo ? (
                  <PayloadImage media={data.logo} alt={data.brandName ?? ''} />
                ) : (
                  data.brandName
                )}
              </Link>{' '}
            </div>
            <div className="flex items-center gap-6">
              <SocialLinks
                items={social}
                className="flex items-center gap-3 max-lg:hidden"
                linkClassName="w-8 h-8"
              />
              <CtaButton
                label={data.cta?.label}
                href={data.cta?.href}
                className="bg-ink border-none text-paper py-3 px-4 rounded-lg text-base"
              />
            </div>
          </div>
          <div className="mx-auto md:pr-6 max-xl:pr-2 flex items-center justify-between  border-b border-line max-md:px-5">
            <DesktopNav nav={nav} isActive={isActive} />
            <HeaderMeta signalsToday={signalsToday} />
          </div>
        </div>
      </header>

      <MobileMenu
        nav={nav}
        social={social}
        cta={data.cta}
        isActive={isActive}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
