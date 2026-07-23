import Link from 'next/link'
import { Fragment } from 'react'
import type { Author, LiveFeed, User } from '@/payload-types'

interface BylineProps {
  authors: LiveFeed['authors']
  editor?: LiveFeed['lastEditedBy']
  className?: string
}

/** Separator before author `i`: "A, B, and C" (Oxford comma for 3+). */
function separator(i: number, count: number): string | null {
  if (i === 0) return null
  if (i === count - 1) return count > 2 ? ', and ' : ' and '
  return ', '
}

export function Byline({ authors, editor, className }: BylineProps) {
  const people = (authors ?? []).filter((a): a is Author => typeof a === 'object' && a !== null)
  const editorObj = editor && typeof editor === 'object' ? (editor as User) : null
  const editorName = editorObj?.name

  if (people.length === 0 && !editorName) return null

  return (
    <div className={`text-muted text-sm ${className ?? ''}`}>
      {people.length > 0 && (
        <>
          By{' '}
          {people.map((a, i) => (
            <Fragment key={a.id}>
              {separator(i, people.length)}
              <Link
                href={`/author/${a.slug}`}
                className="font-medium text-foreground hover:underline"
              >
                {a.name}
              </Link>
            </Fragment>
          ))}
        </>
      )}

      {editorName && (
        <>
          {people.length > 0 && <span className="px-2 text-line">|</span>}
          Edited by <span className="font-medium text-foreground">{editorName}</span>
        </>
      )}
    </div>
  )
}
