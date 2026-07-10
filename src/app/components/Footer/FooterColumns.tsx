import Link from 'next/link'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Footer } from '@/payload-types'

export function FooterColumns({ columns }: { columns: NonNullable<Footer['columns']> }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 border-t border-line-a08 pt-10 md:grid-cols-3">
      {columns.map((col, ci) => (
        <div key={ci}>
          <div className="text-xs tracking-wider font-medium text-muted-3 font-mono">{col.title}</div>
          <ul className="mt-4 space-y-2.5 pl-0">
            {(col.items ?? []).map((item, ii) => (
              <li key={ii}>
                <Link href={resolveLinkHref(item.link)} className="group inline-block">
                  <span className="text-sm text-cream">{item.link?.label}</span>
                  <span className="block h-px w-full scale-x-0 bg-cream origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
