/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TEMPORARY STUB — replaced by `pnpm generate:types` once a database is connected.
 * This permissive shape lets blocks/collections typecheck before Payload boots.
 */

export type PageBlockType =
  | 'hero'
  | 'call-to-action'
  | 'rich-text-block'
  | 'media-with-text'
  | 'content-media'
  | 'text-columns'
  | 'feature-grid'
  | 'image-grid'
  | 'logo-cloud'
  | 'testimonials'
  | 'faq'
  | 'stats'
  | 'stats-chart'
  | 'contact-form-block'

interface BlockOf<T extends PageBlockType> {
  id?: string
  blockName?: string
  blockType: T
  [key: string]: any
}

export type PageBlock =
  | BlockOf<'hero'>
  | BlockOf<'call-to-action'>
  | BlockOf<'rich-text-block'>
  | BlockOf<'media-with-text'>
  | BlockOf<'content-media'>
  | BlockOf<'text-columns'>
  | BlockOf<'feature-grid'>
  | BlockOf<'image-grid'>
  | BlockOf<'logo-cloud'>
  | BlockOf<'testimonials'>
  | BlockOf<'faq'>
  | BlockOf<'stats'>
  | BlockOf<'stats-chart'>
  | BlockOf<'contact-form-block'>

export interface Media {
  id: string
  alt?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  caption?: string | null
}

export interface User {
  id: string
  email: string
  name?: string | null
  role: 'admin' | 'editor'
}

export interface Page {
  id: string
  title: string
  slug: string
  blocks?: PageBlock[] | null
  parent?: any
  breadcrumbs?: any
  meta?: {
    title?: string
    description?: string
    image?: Media | string | null
  }
  _status?: 'draft' | 'published' | null
  updatedAt: string
  createdAt: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: Media | string | null
  content: any
  author?: User | string | null
  categories?: (Category | string)[] | null
  tags?: (Tag | string)[] | null
  publishedAt?: string | null
  meta?: any
  _status?: 'draft' | 'published' | null
  updatedAt: string
  createdAt: string
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: Media | string | null
  content: any
  client?: string | null
  industry?: string | null
  services?: { name: string; id?: string }[] | null
  duration?: string | null
  relatedCaseStudies?: (CaseStudy | string)[] | null
  publishedAt?: string | null
  meta?: any
  _status?: 'draft' | 'published' | null
  updatedAt: string
  createdAt: string
}

export interface Category {
  id: string
  title: string
  slug: string
  description?: string | null
}

export interface Tag {
  id: string
  title: string
  slug: string
}

export interface Form {
  id: string
  title: string
  fields?: any[] | null
  confirmationMessage?: any
  submitButtonLabel?: string | null
}

export interface Header {
  id: string
  logo?: Media | string | null
  items?: { link: any; id?: string }[] | null
}

export interface Footer {
  id: string
  columns?: { title?: string | null; items?: { link: any; id?: string }[] | null; id?: string }[] | null
  social?: { platform: string; url: string; id?: string }[] | null
  copyright?: string | null
}
