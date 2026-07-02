/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import { isMultiLocale } from '@/i18n/config'
import { PayloadImage } from './PayloadImage'
import { siteConfig } from '@/utilities/siteConfig'

export async function Header() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'header' })
  const hasLogo = typeof data.logo === 'object' && data.logo?.url

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold">
          {hasLogo ? (
            <PayloadImage media={data.logo} alt="Logo" className="h-8 w-auto" priority />
          ) : (
            siteConfig.name
          )}
        </Link>
        <nav className="flex gap-6 items-center">
          {(data.items ?? []).map((item: any, i: number) => {
            const link = item.link
            const href =
              link?.type === 'reference' && typeof link.reference?.value === 'object'
                ? `/${link.reference.value.slug ?? ''}`
                : link?.url ?? '#'
            return (
              <Link
                key={item.id ?? i}
                href={href}
                target={link?.newTab ? '_blank' : undefined}
              >
                {link?.label ?? ''}
              </Link>
            )
          })}
          {isMultiLocale && <LanguageSwitcher />}
        </nav>
      </div>
    </header>
  )
}
