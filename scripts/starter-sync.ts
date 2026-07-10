#!/usr/bin/env tsx
import { Project } from 'ts-morph'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { applyI18nCodemod, type CodemodOptions } from './codemods/i18n'
import starterConfig from '../starter.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const COLLECTION_FILES: { slug: string; file: string }[] = [
  { slug: 'pages', file: 'src/collections/Pages/index.ts' },
  { slug: 'blog', file: 'src/collections/Blog/index.ts' },
  { slug: 'categories', file: 'src/collections/Categories.ts' },
  { slug: 'tags', file: 'src/collections/Tags.ts' },
  { slug: 'media', file: 'src/collections/Media.ts' },
  { slug: 'users', file: 'src/collections/Users.ts' },
]

const flags = new Set(process.argv.slice(2))
const confirmShrink = flags.has('--confirm-locale-shrink')

const localeCount = starterConfig.i18n.locales.length
const willAdd = localeCount > 1
const willRemove = localeCount <= 1 && confirmShrink

if (!willAdd && !willRemove) {
  if (localeCount <= 1) {
    console.log(
      '[starter:sync] locales.length === 1; skipping i18n codemod.\n' +
        'If you previously had multiple locales and want to remove `localized: true` from fields,\n' +
        'rerun with --confirm-locale-shrink (this generates a destructive migration).',
    )
  }
  console.log('[starter:sync] regenerating types...')
  execSync('pnpm generate:types', { stdio: 'inherit', cwd: ROOT })
  process.exit(0)
}

const opts: CodemodOptions = {
  mode: willRemove ? 'remove' : 'add',
  skipFields: starterConfig.i18n.skipFields ?? [],
  forceFields: starterConfig.i18n.forceFields ?? [],
  skipCollections: starterConfig.i18n.skipCollections ?? [],
}

const project = new Project({ tsConfigFilePath: path.join(ROOT, 'tsconfig.json') })

console.log(`[starter:sync] applying i18n codemod (mode: ${opts.mode})...`)
for (const { slug, file } of COLLECTION_FILES) {
  const sourceFile = project.addSourceFileAtPathIfExists(path.join(ROOT, file))
  if (!sourceFile) continue
  applyI18nCodemod(sourceFile, slug, opts)
  console.log(` ✓ ${slug}`)
}

console.log('[starter:sync] regenerating types...')
execSync('pnpm generate:types', { stdio: 'inherit', cwd: ROOT })

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
console.log('[starter:sync] creating migration...')
execSync(`pnpm migrate:create --name=starter-sync-${stamp}`, { stdio: 'inherit', cwd: ROOT })

console.log(
  '\n[starter:sync] done. Review the migration in src/migrations/ before running `pnpm migrate`.',
)
