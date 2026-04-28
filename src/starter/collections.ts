import type { CollectionConfig } from 'payload'
import type { CollectionsConfig } from './types'

export interface CollectionRegistry {
  Users: CollectionConfig
  Media: CollectionConfig
  Pages: CollectionConfig
  Blog: CollectionConfig
  CaseStudies: CollectionConfig
  Categories: CollectionConfig
  Tags: CollectionConfig
}

export function buildCollections(
  registry: CollectionRegistry,
  toggles: CollectionsConfig,
): CollectionConfig[] {
  const list: CollectionConfig[] = [registry.Users, registry.Media, registry.Pages]
  if (toggles.blog) list.push(registry.Blog)
  if (toggles.caseStudies) list.push(registry.CaseStudies)
  if (toggles.categories && (toggles.blog || toggles.caseStudies)) list.push(registry.Categories)
  if (toggles.tags && toggles.blog) list.push(registry.Tags)
  return list
}
