import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
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
            const base = collectionConfig?.slug === 'pages' ? '' : `/${collectionConfig?.slug ?? ''}`
            return `${process.env.NEXT_PUBLIC_SERVER_URL}${base}/${slug}?preview=${process.env.PREVIEW_SECRET ?? ''}`
          },
        }
      : undefined,
  },
  editor: wideMarkupLexical,
  collections,
  globals: [],
  plugins,
  db: resolveDbAdapter(starterConfig.database),
  email: resolveEmailAdapter(starterConfig.email),
  localization: resolveLocalization(starterConfig.i18n),
  secret: process.env.PAYLOAD_SECRET || 'unset',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
