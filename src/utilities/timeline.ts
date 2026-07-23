/** Newest-first by the `at` timestamp; entries without `at` sort last. Returns a new array. */
export const sortByNewest = <T extends { at?: string | null }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => new Date(b.at ?? 0).getTime() - new Date(a.at ?? 0).getTime())
