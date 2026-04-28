/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import { isMultiLocale } from '@/i18n/config'

export async function Header() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'header' })
  const logo = typeof data.logo === 'object' ? (data.logo as { url?: string }) : null

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold">
          {logo?.url ? (
            <img src={logo.url} alt="Logo" className="h-8" />
          ) : (
            'Payload Starter'
          )}
        </Link>
        <nav className="flex gap-6 items-center">
          {(data.items ?? []).map((item: { link?: any; id?: string }, i: number) => {
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
