import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import type { FeaturesConfig } from './types'

export function buildPlugins(features: FeaturesConfig) {
  const plugins = []

  if (features.seo) {
    plugins.push(
      seoPlugin({
        collections: ['pages', 'blog', 'case-studies', 'signals', 'live-feed'],
        uploadsCollection: 'media',
        generateTitle: ({ doc }: { doc?: { title?: string } }) => `${doc?.title ?? 'Untitled'}`,
      }),
    )
  }

  if (features.redirects) {
    plugins.push(
      redirectsPlugin({
        collections: ['pages', 'blog', 'case-studies'],
      }),
    )
  }

  if (features.search) {
    plugins.push(
      searchPlugin({
        collections: ['pages', 'blog', 'case-studies', 'signals', 'live-feed'],
        defaultPriorities: {
          pages: 10,
          blog: 20,
          'case-studies': 30,
          signals: 40,
          'live-feed': 50,
        },
      }),
    )
  }

  if (features.formBuilder) {
    plugins.push(
      formBuilderPlugin({
        fields: { payment: false },
      }),
    )
  }

  if (features.nestedDocs) {
    plugins.push(
      nestedDocsPlugin({
        collections: ['pages'],
        generateLabel: (_, doc) => (doc.title as string) ?? '',
        generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
      }),
    )
  }

  if (features.importExport) {
    plugins.push(
      importExportPlugin({
        collections: [
          { slug: 'pages' },
          { slug: 'blog' },
          { slug: 'case-studies' },
          { slug: 'signals' },
          { slug: 'live-feed' },
          { slug: 'media' },
        ],
      }),
    )
  }

  return plugins
}
