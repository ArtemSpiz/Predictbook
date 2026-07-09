import Link from 'next/link'
import Home from '../../../public/Home.png'
import { Fragment } from 'react'
import Image from 'next/image'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  showHomeIcon?: boolean
  homeHref?: string
  separator?: string
  className?: string
}

/**
 * Універсальний компонент хлібних крихт.
 *
 * Приклади використання:
 *
 * <Breadcrumbs items={[{ label: "Analysis", href: "/analysis" }, { label: "Who's betting on EU AI Act approval before September?" }]} />
 *
 * <Breadcrumbs
 *   items={[
 *     { label: "Category", href: "/category" },
 *     { label: "Subcategory", href: "/category/sub" },
 *     { label: "Deep page", href: "/category/sub/deep" },
 *     { label: "Current page" },
 *   ]}
 * />
 *
 * <Breadcrumbs items={[{ label: "Current page" }]} showHomeIcon={false} />
 */
export function Breadcrumbs({
  items,
  showHomeIcon = true,
  homeHref = '/',
  separator = '•',
  className = '',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap pl-0 my-0">
        {showHomeIcon && (
          <li className="flex items-center gap-2">
            <Link
              href={homeHref}
              aria-label="Home"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Image src={Home} alt="" className="w-4 h-4" />
            </Link>
            <span className="text-gray-300 select-none">{separator}</span>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="flex items-center gap-2 min-w-0">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className=" max-w-[250px] font-medium hover:text-gray-700 transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div
                    className={`truncate max-w-[250px] ${isLast ? 'text-muted-2' : ' font-medium'}`}
                  >
                    {item.label}
                  </div>
                )}
              </li>

              {!isLast && (
                <div aria-hidden="true" className="text-line select-none">
                  {separator}
                </div>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
