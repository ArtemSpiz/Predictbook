import type { CollectionConfig } from 'payload'
import type { CollectionsConfig } from './types'

export interface CollectionRegistry {
  Users: CollectionConfig
  Media: CollectionConfig
  Pages: CollectionConfig
  News: CollectionConfig
  Categories: CollectionConfig
  Tags: CollectionConfig
}

export function buildCollections(
  registry: CollectionRegistry,
  toggles: CollectionsConfig,
): CollectionConfig[] {
  const list: CollectionConfig[] = [registry.Users, registry.Media, registry.Pages]
  if (toggles.news) list.push(registry.News)
  if (toggles.categories && toggles.news) list.push(registry.Categories)
  if (toggles.tags && toggles.news) list.push(registry.Tags)
  return list
}
