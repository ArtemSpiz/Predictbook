import { buildSitemapShardEntries, entriesToUrlset } from '@/utilities/sitemapXml'

export const revalidate = 3600

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params
  const match = /^(\d+)\.xml$/.exec(raw)
  if (!match) return new Response('Not found', { status: 404 })
  const entries = await buildSitemapShardEntries(Number(match[1]))
  return new Response(entriesToUrlset(entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
