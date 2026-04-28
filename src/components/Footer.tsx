/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export async function Footer() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'footer' })

  return (
    <footer className="border-t mt-16 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {(data.columns ?? []).map(
          (
            col: { title?: string; items?: { link?: any; id?: string }[]; id?: string },
            i: number,
          ) => (
            <div key={col.id ?? i}>
              {col.title && <h4 className="font-semibold mb-3">{col.title}</h4>}
              <ul className="space-y-2 text-sm">
                {(col.items ?? []).map(
                  (it: { link?: any; id?: string }, j: number) => {
                    const link = it.link
                    const href =
                      link?.type === 'reference' && typeof link.reference?.value === 'object'
                        ? `/${link.reference.value.slug ?? ''}`
                        : link?.url ?? '#'
                    return (
                      <li key={it.id ?? j}>
                        <Link href={href}>{link?.label ?? ''}</Link>
                      </li>
                    )
                  },
                )}
              </ul>
            </div>
          ),
        )}
      </div>
      {data.copyright && (
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t text-sm text-gray-500 text-center">
          {data.copyright}
        </div>
      )}
    </footer>
  )
}
