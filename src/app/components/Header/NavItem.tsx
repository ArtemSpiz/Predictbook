import Image from 'next/image'
import Down from '@/../public/down.png'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function NavItem({ item, active }: { item: NavEntry; active: boolean }) {
  const children = item.children ?? []
  const hasChildren = children.length > 0
  const href = resolveLinkHref(item.link)
  return (
    <div className="relative group ">
      <a
        href={href === '#' ? undefined : href}
        className="flex items-center gap-2 p-4 max-xl:p-3 hover:bg-shell group-hover:bg-shell w-[110px]"
      >
        <span className={`text-sm ${active ? 'font-bold' : 'font-normal'}`}>
          {item.link?.label}
        </span>
        {hasChildren && (
          <Image src={Down} alt="" className="w-3 transition-transform group-hover:-rotate-180" />
        )}
      </a>
      {hasChildren && (
        <div className="absolute left-0 mx-auto top-full hidden group-hover:block bg-shell min-w-[110px] z-20 ">
          {children.map((child, i) => (
            <a
              key={i}
              href={resolveLinkHref(child.link)}
              className="block p-4 text-sm text-left  border-t border-paper hover:bg-sand-2"
            >
              {child.link?.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
