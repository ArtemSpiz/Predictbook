export const SITEMAP_SHARD_SIZE = 10000

/** Shard 0 is the "core" sitemap (static routes + CMS pages + live-feed).
 * Shards 1..n each hold up to `size` news URLs. */
export function sitemapShardIds(
  newsCount: number,
  size: number = SITEMAP_SHARD_SIZE,
): { id: number }[] {
  const newsShards = Math.ceil(Math.max(0, newsCount) / size)
  const ids = [{ id: 0 }]
  for (let i = 1; i <= newsShards; i++) ids.push({ id: i })
  return ids
}
