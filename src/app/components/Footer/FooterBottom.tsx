export function FooterBottom({
  disclaimer,
  copyright,
}: {
  disclaimer?: string | null
  copyright?: string | null
}) {
  const copyrightText = (copyright ?? '').replace('{year}', String(new Date().getFullYear()))
  return (
    <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line-a08 pt-6 text-xs text-muted-4 md:flex-row md:items-center md:justify-between">
      <div className="max-w-xl">{disclaimer}</div>
      <div className="whitespace-nowrap text-white-a80">{copyrightText}</div>
    </div>
  )
}
