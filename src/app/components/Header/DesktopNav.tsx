import { NavItem } from './NavItem'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function DesktopNav({
  nav,
  isActive,
}: {
  nav: NonNullable<Header['nav']>
  isActive: (item: NavEntry) => boolean
}) {
  return (
    <div className="flex max-lg:hidden">
      {nav.map((item, i) => (
        <NavItem key={i} item={item} active={isActive(item)} />
      ))}
    </div>
  )
}
