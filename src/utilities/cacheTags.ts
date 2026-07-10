/**
 * Single source of truth for `unstable_cache` tag names. Fetchers tag their
 * cache entries and the Payload revalidation hook flushes the same strings, so
 * both must go through here. `all` stays as the coarse "flush everything"
 * fallback used by the manual /api/revalidate webhook.
 */
export const cacheTags = {
  all: 'payload' as const,
  collection: (slug: string) => `payload:col:${slug}`,
  docSlug: (slug: string, urlSlug: string) => `payload:slug:${slug}:${urlSlug}`,
  global: (name: string) => `payload:global:${name}`,
}
