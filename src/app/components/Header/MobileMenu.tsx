'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Down from '@/../public/down.png'
import { SocialLinks, type SocialItem } from '@/app/ui/SocialLinks'
import { CtaButton } from './CtaButton'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function MobileMenu({
  nav,
  social,
  cta,
  isActive,
  isOpen,
  onClose,
}: {
  nav: NonNullable<Header['nav']>
  social: SocialItem[]
  cta: Header['cta']
  isActive: (item: NavEntry) => boolean
  isOpen: boolean
  onClose: () => void
}) {
  const [analysisOpen, setAnalysisOpen] = useState(false)
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[320px] bg-paper shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="text-3xl bg-transparent leading-none">
            ×
          </button>
        </div>

        <div className="py-2">
          {nav.map((item, i) => {
            const children = item.children ?? []
            return (
              <div key={i}>
                {children.length === 0 ? (
                  <Link
                    href={resolveLinkHref(item.link)}
                    onClick={onClose}
                    className={`block border-b border-line px-6 py-5 text-lg ${
                      isActive(item) ? 'font-bold' : ''
                    }`}
                  >
                    {item.link?.label}
                  </Link>
                ) : (
                  <>
                    <a
                      onClick={() => setAnalysisOpen(!analysisOpen)}
                      className="flex w-full bg-transparent items-center justify-between border-b border-line px-6 py-5 text-lg"
                    >
                      <span className={isActive(item) ? 'font-bold' : ''}>{item.link?.label}</span>
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
                      {children.map((child, ci) => (
                        <Link
                          key={ci}
                          href={resolveLinkHref(child.link)}
                          onClick={onClose}
                          className="block bg-shell-2 px-10 py-4 text-muted"
                        >
                          {child.link?.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className=" p-6">
          <CtaButton label={cta?.label} href={cta?.href} className="w-full rounded-lg bg-ink py-3 text-white" />
          <SocialLinks
            items={social}
            className="mt-6 items-center justify-center flex gap-4"
            linkClassName="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow"
            iconClassName="w-5"
          />
        </div>
      </div>
    </>
  )
}
