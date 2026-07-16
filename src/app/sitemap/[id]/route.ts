import { buildSitemapByName, entriesToUrlset } from '@/utilities/sitemapXml'

export const revalidate = 3600

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entries = await buildSitemapByName(id)
  if (entries === null) return new Response('Not found', { status: 404 })
  return new Response(entriesToUrlset(entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
