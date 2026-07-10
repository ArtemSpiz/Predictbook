import { getSiteUrl } from '@/utilities/getSiteUrl'
import { sitemapShardIds } from '@/utilities/sitemapShards'
import { shardIndexXml, sitemapNewsCount } from '@/utilities/sitemapXml'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const ids = sitemapShardIds(await sitemapNewsCount())
  return new Response(shardIndexXml(base, ids), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
