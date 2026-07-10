import Image from 'next/image'
import Down from '@/../public/down.png'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function NavItem({ item, active }: { item: NavEntry; active: boolean }) {
  const children = item.children ?? []
  const hasChildren = children.length > 0
  return (
    <div className="relative group  border-r border-line">
      <a
        href={resolveLinkHref(item.link)}
        className="flex items-center gap-2 p-4 max-xl:p-3 hover:bg-shell group-hover:bg-shell"
      >
        <span className={`text-sm ${active ? 'font-bold' : 'font-normal'}`}>{item.link?.label}</span>
        {hasChildren && (
          <Image src={Down} alt="" className="w-3 transition-transform group-hover:-rotate-180" />
        )}
      </a>
      {hasChildren && (
        <div className="absolute left-0 mx-auto top-full hidden group-hover:block bg-shell min-w-[105px] z-20 ">
          {children.map((child, i) => (
            <a
              key={i}
              href={resolveLinkHref(child.link)}
              className="block p-4 text-sm text-center  border-t border-paper hover:bg-sand-2"
            >
              {child.link?.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
