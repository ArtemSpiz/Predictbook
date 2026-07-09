export type Accent = 'politics' | 'sports' | 'crypto' | 'tech' | 'science'

export const ACCENT_VALUES: Accent[] = ['politics', 'sports', 'crypto', 'tech', 'science']

export const ACCENT_CLASSES: Record<Accent, string> = {
  politics: 'border-cat-politics-border text-cat-politics-text bg-cat-politics-bg',
  sports: 'border-cat-sports-border text-cat-sports-text bg-cat-sports-bg',
  crypto: 'border-cat-crypto-border text-cat-crypto-text bg-cat-crypto-bg',
  tech: 'border-cat-tech-border text-cat-tech-text bg-cat-tech-bg',
  science: 'border-cat-science-border text-cat-science-text bg-cat-science-bg',
}

export function accentClasses(accent: string): string {
  return ACCENT_CLASSES[accent as Accent] ?? ACCENT_CLASSES.politics
}
