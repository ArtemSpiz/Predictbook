import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { wideMarkupLexical } from './fields/wideMarkupLexical'

import starterConfig from '../starter.config'
import { resolveDbAdapter } from './starter/adapters/db'
import { resolveStorageAdapter } from './starter/adapters/storage'
import { resolveEmailAdapter } from './starter/adapters/email'
import { buildPlugins } from './starter/plugins'
import { buildCollections } from './starter/collections'
import { resolveLocalization } from './starter/i18n'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Blog } from './collections/Blog'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Translations } from './globals/Translations'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections = buildCollections(
  { Users, Media, Pages, Blog, CaseStudies, Categories, Tags },
  starterConfig.collections,
)

const storagePlugin = resolveStorageAdapter(starterConfig.storage)
const featurePlugins = buildPlugins(starterConfig.features)
const plugins = storagePlugin ? [storagePlugin, ...featurePlugins] : featurePlugins

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
    livePreview: starterConfig.features.livePreview
      ? {
          url: ({
            data,
            collectionConfig,
          }: {
            data?: { slug?: string }
            collectionConfig?: { slug?: string }
          }) => {
            const slug = data?.slug ?? ''
            const coll = collectionConfig?.slug
            const path = coll === 'pages' ? `/${slug}` : `/${coll ?? ''}/${slug}`
            const server = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
            // Route through the preview endpoint so Next draft mode is enabled
            // before landing on the page (renders unpublished content).
            return `${server}/next/preview?secret=${process.env.PREVIEW_SECRET ?? ''}&path=${encodeURIComponent(path)}`
          },
        }
      : undefined,
  },
  editor: wideMarkupLexical,
  collections,
  globals:
    starterConfig.i18n.locales.length > 1
      ? [Header, Footer, SiteSettings, Translations]
      : [Header, Footer, SiteSettings],
  plugins,
  db: resolveDbAdapter(starterConfig.database),
  sharp,
  email: resolveEmailAdapter(starterConfig.email),
  localization: resolveLocalization(starterConfig.i18n),
  secret: process.env.PAYLOAD_SECRET || 'unset',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
