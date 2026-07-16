// News posts are split into files that each stay under the sitemap protocol's
// 50k-URL limit. A single shard is `posts.xml`; more become `posts-1.xml`…`posts-N.xml`.
export const POSTS_SHARD_SIZE = 45000

export function postsSitemapNames(count: number, size: number = POSTS_SHARD_SIZE): string[] {
  const shards = Math.ceil(Math.max(0, count) / size)
  if (shards <= 1) return ['posts.xml']
  return Array.from({ length: shards }, (_, i) => `posts-${i + 1}.xml`)
}

/** 1-based page for a posts sitemap file name, or null if the name isn't a posts sitemap. */
export function postsSitemapPage(name: string): number | null {
  const m = /^posts(?:-(\d+))?\.xml$/.exec(name)
  if (!m) return null
  return m[1] ? Number(m[1]) : 1
}
