import type { ReactNode } from 'react'

/** Shared page shell: bordered two-column row on desktop that stacks into a
 * single column with light padding on tablet and mobile. Children are the main
 * content and the sidebar. */
export function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-5 border-line p-6 max-lg:flex-col max-lg:p-2 md:border-l md:border-r">
      {children}
    </div>
  )
}
