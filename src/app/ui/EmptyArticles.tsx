import Link from 'next/link'

export function EmptyArticles({ message }: { message: string }) {
  return (
    <div className=" border-t border-b border-line py-20 text-center">
      <h2 className="text-2xl font-semibold">No articles found</h2>
      <p className="mt-2 text-gray-text">{message}</p>

      <Link
        href="/analysis"
        className="bg-ink border-none text-paper py-3 px-4 rounded-lg text-base mt-3 inline-flex"
      >
        Back to all articles
      </Link>
    </div>
  )
}
