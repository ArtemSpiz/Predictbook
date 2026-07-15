export type LinkValue =
  | {
      type?: 'reference' | 'custom' | null
      reference?: { relationTo?: string; value?: unknown } | null
      url?: string | null
      label?: string | null
      newTab?: boolean | null
    }
  | null
  | undefined

/** Resolve a `linkField` value to an href. Internal `news` refs map to
 * `/analysis/<slug>`, other refs to `/<slug>`; custom links use their url. */
export function resolveLinkHref(link: LinkValue): string {
  if (
    link?.type === 'reference' &&
    link.reference &&
    typeof link.reference.value === 'object' &&
    link.reference.value !== null
  ) {
    const slug = (link.reference.value as { slug?: string }).slug ?? ''
    return link.reference.relationTo === 'news' ? `/analysis/${slug}` : `/${slug}`
  }
  return link?.url ?? '#'
}
