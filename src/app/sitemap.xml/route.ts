import { getSiteUrl } from '@/utilities/getSiteUrl'
import { sitemapChildNames, sitemapIndexXml } from '@/utilities/sitemapXml'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const names = await sitemapChildNames()
  return new Response(sitemapIndexXml(base, names), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
