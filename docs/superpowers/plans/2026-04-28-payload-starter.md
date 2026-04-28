# Payload Starter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a domain-agnostic Payload CMS 3.x + Next.js 15 starter at `~/Work/payload-starter/`, configurable via a single typed `starter.config.ts`, with optional providers (DB/storage/email), opt-in features (GSAP/Swiper/charts), 13 generic blocks, Blog + CaseStudies collections, Lexical editor presets, and `pnpm starter:sync` codemod for i18n field patching.

**Architecture:** All project-level choices live in `starter.config.ts`. `payload.config.ts` reads it and conditionally wires DB adapter, storage adapter, email adapter, plugin set, collection set, and Payload localization. Optional features are tree-shakeable. The i18n codemod uses `ts-morph` AST manipulation to add/remove `localized: true` based on a denylist with config overrides.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3.x, TypeScript 5.x strict, Drizzle (Postgres + SQLite), Tailwind 3.x, Lexical (via `@payloadcms/richtext-lexical`), Recharts, Vitest + Playwright, pnpm 10.

**Spec reference:** `docs/superpowers/specs/2026-04-28-payload-starter-design.md`

---

## Working Directory

All commands run from `/Users/silentfox/Work/payload-starter/` unless noted. The repo is already `git init`'d. **Make NO changes to `~/Work/payload-test/`.**

---

## File-Map (Complete Output)

```
payload-starter/
├── package.json, pnpm-lock.yaml, tsconfig.json, next-env.d.ts
├── next.config.js, eslint.config.mjs, prettier.config.mjs
├── postcss.config.js, tailwind.config.mjs
├── playwright.config.ts, vitest.config.mts, vitest.setup.ts
├── next-sitemap.config.cjs, vercel.json
├── Dockerfile, docker-compose.yml, docker-compose.sqlite.yml
├── starter.config.ts
├── .env.example, .gitignore, .gitattributes, .editorconfig
├── .prettierignore, .eslintignore, LICENSE, README.md
├── public/blocks/{hero,call-to-action,...}.png   (13 placeholders)
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx, page.tsx, globals.css, not-found.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── blog/{page.tsx,[slug]/page.tsx,category/[slug]/page.tsx,tag/[slug]/page.tsx}
│   │   │   └── case-studies/{page.tsx,[slug]/page.tsx}
│   │   └── (payload)/
│   │       ├── layout.tsx
│   │       ├── admin/[[...segments]]/{page.tsx,not-found.tsx}
│   │       └── api/{[...slug],graphql,graphql-playground}/route.ts
│   ├── starter/
│   │   ├── types.ts, define.ts
│   │   ├── adapters/{db,storage,email}.ts (+ .test.ts each)
│   │   ├── plugins.ts (+ .test.ts), collections.ts, i18n.ts
│   ├── collections/
│   │   ├── Users.ts, Media.ts, Categories.ts, Tags.ts
│   │   ├── Pages/{index.ts,access.ts}
│   │   ├── Blog/{index.ts,access.ts}
│   │   ├── CaseStudies/{index.ts,access.ts}
│   ├── globals/{Header.ts,Footer.ts,Translations.ts}
│   ├── blocks/
│   │   ├── RenderBlocks.tsx
│   │   └── {Hero,CallToAction,RichTextBlock,MediaWithText,ContentMedia,
│   │        TextColumns,FeatureGrid,ImageGrid,LogoCloud,Testimonials,
│   │        FAQ,Stats,StatsChart}/{config.ts,Component.tsx}
│   ├── fields/{defaultLexical,wideMarkupLexical,slug,link}.ts
│   ├── features/highlight/{feature.server.ts,feature.client.tsx,components/HighlightNode.ts}
│   ├── i18n/{config.ts,locales/en.json}
│   ├── utilities/{seo,getGlobals,getMediaUrl,getTranslations}.ts
│   ├── components/{LanguageSwitcher.tsx,...}
│   ├── access/{isAdmin,isAdminOrEditor}.ts
│   ├── middleware.ts, payload.config.ts, payload-types.ts, environment.d.ts
├── scripts/
│   ├── starter-sync.ts, seed.ts, reset-db.ts
│   ├── codemods/{i18n.ts,i18n.test.ts}
│   └── seed-data/{pages.ts,blog.ts,case-studies.ts}
├── tests/e2e/{admin,frontend,sitemap}.spec.ts
└── docs/superpowers/{specs,plans}/...
```

---

## Phase Roadmap

| Phase | Tasks    | Deliverable / Checkpoint                                                                 |
| ----- | -------- | ---------------------------------------------------------------------------------------- |
| 0     | 1–4      | Repo bootstrap: `pnpm install` succeeds, `pnpm dev` shows blank Next.js page             |
| 1     | 5–7      | Central config: `starter.config.ts` typed and importable                                 |
| 2     | 8–13     | Adapters wired: payload.config.ts boots with chosen DB/storage/email                     |
| 3     | 14–17    | Users + Media + admin: log into `/admin`, upload media                                   |
| 4     | 18–21    | Lexical: defaultLexical + wideMarkupLexical + working `highlight` example feature        |
| 5     | 22–25    | Pages collection + RenderBlocks + first block (Hero) — Pages render on frontend          |
| 6     | 26–37    | All 13 blocks built and registered                                                       |
| 7     | 38–41    | Blog + CaseStudies + Categories + Tags collections                                       |
| 8     | 42–46    | Frontend routes + Header/Footer globals + i18n infrastructure                            |
| 9     | 47–52    | Plugins (SEO, Redirects, Search, Form Builder, Nested Docs, Import-Export)               |
| 10    | 53–56    | i18n codemod + `pnpm starter:sync`                                                       |
| 11    | 57–59    | Seed scripts: `pnpm seed` populates sample content                                       |
| 12    | 60–63    | Tests: vitest unit tests, playwright smoke tests pass                                    |
| 13    | 64–67    | Docker + deployment + `.env.example` finalized                                           |
| 14    | 68–70    | README + final validation against success criteria                                       |

---

## Phase 0 — Repo Bootstrap

### Task 1: Initialize package.json + tsconfig

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `.gitattributes`
- Create: `.editorconfig`
- Create: `pnpm-workspace.yaml` (empty workspace marker, prevents accidental install into parent workspaces)

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "payload-starter",
  "version": "0.1.0",
  "description": "Domain-agnostic Payload CMS + Next.js starter",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start",
    "lint": "cross-env NODE_OPTIONS=--no-deprecation next lint",
    "lint:fix": "cross-env NODE_OPTIONS=--no-deprecation next lint --fix",
    "typecheck": "tsc --noEmit",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "migrate": "cross-env NODE_OPTIONS=--no-deprecation payload migrate",
    "migrate:create": "cross-env NODE_OPTIONS=--no-deprecation payload migrate:create",
    "migrate:status": "cross-env NODE_OPTIONS=--no-deprecation payload migrate:status",
    "starter:sync": "tsx scripts/starter-sync.ts",
    "seed": "tsx scripts/seed.ts",
    "seed:reset": "tsx scripts/seed.ts --reset",
    "db:reset": "tsx scripts/reset-db.ts",
    "test": "pnpm run test:unit && pnpm run test:e2e",
    "test:unit": "vitest run --config ./vitest.config.mts",
    "test:unit:watch": "vitest --config ./vitest.config.mts",
    "test:e2e": "cross-env NODE_OPTIONS=\"--no-deprecation --no-experimental-strip-types\" playwright test --config=playwright.config.ts"
  },
  "dependencies": {
    "@payloadcms/db-postgres": "^3.64.0",
    "@payloadcms/db-sqlite": "^3.64.0",
    "@payloadcms/email-nodemailer": "^3.64.0",
    "@payloadcms/email-resend": "^3.64.0",
    "@payloadcms/live-preview-react": "^3.64.0",
    "@payloadcms/next": "^3.64.0",
    "@payloadcms/plugin-form-builder": "^3.64.0",
    "@payloadcms/plugin-import-export": "^3.65.0",
    "@payloadcms/plugin-nested-docs": "^3.64.0",
    "@payloadcms/plugin-redirects": "^3.64.0",
    "@payloadcms/plugin-search": "^3.64.0",
    "@payloadcms/plugin-seo": "^3.64.0",
    "@payloadcms/richtext-lexical": "^3.64.0",
    "@payloadcms/storage-gcs": "^3.64.0",
    "@payloadcms/storage-s3": "^3.64.0",
    "@payloadcms/storage-vercel-blob": "^3.64.0",
    "@payloadcms/ui": "^3.64.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cross-env": "^7.0.3",
    "dotenv": "^16.4.7",
    "graphql": "^16.8.2",
    "lucide-react": "^0.378.0",
    "next": "15.4.4",
    "next-sitemap": "^4.2.3",
    "payload": "^3.64.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "recharts": "^2.12.7",
    "sharp": "0.34.4",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@playwright/test": "1.54.1",
    "@tailwindcss/typography": "^0.5.13",
    "@testing-library/react": "^16.3.0",
    "@types/node": "22.5.4",
    "@types/react": "19.1.8",
    "@types/react-dom": "19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.16.0",
    "eslint-config-next": "15.4.4",
    "jsdom": "^26.1.0",
    "playwright": "1.54.1",
    "postcss": "^8.4.38",
    "prettier": "^3.4.2",
    "tailwindcss": "^3.4.3",
    "ts-morph": "^24.0.0",
    "tsx": "^4.20.6",
    "typescript": "5.7.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.3"
  },
  "packageManager": "pnpm@10.18.1",
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["sharp", "esbuild", "unrs-resolver"]
  }
}
```

Optional deps (added later by toggles): `swiper`, `gsap`, `nodemailer-sendgrid`, `@ghosthaise/payload-audit-log`, `react-hook-form`. They are added in their respective phase tasks, not here.

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  },
  "include": [
    "next-env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "scripts/**/*.ts",
    "tests/**/*.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 4: Write `.gitignore`**

```gitignore
node_modules
.next
.vercel
out
dist
build
*.tsbuildinfo
.env
.env.*
!.env.example
*.log
.DS_Store
.idea
.vscode/*
!.vscode/settings.json.example
coverage
playwright-report
test-results
public/media
local.db
local.db-journal
gcs-key.json
```

- [ ] **Step 5: Write `.gitattributes`**

```
* text=auto eol=lf
*.png binary
*.jpg binary
*.webp binary
*.mp4 binary
```

- [ ] **Step 6: Write `.editorconfig`**

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 7: Write `pnpm-workspace.yaml`**

```yaml
packages: []
```

- [ ] **Step 8: Run install**

```bash
pnpm install
```

Expected: lockfile created, no errors.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: bootstrap package.json, tsconfig, gitignore"
```

---

### Task 2: ESLint, Prettier, Tailwind, PostCSS configs

**Files:**
- Create: `eslint.config.mjs`
- Create: `prettier.config.mjs`
- Create: `.prettierignore`
- Create: `.eslintignore`
- Create: `tailwind.config.mjs`
- Create: `postcss.config.js`

- [ ] **Step 1: `eslint.config.mjs`**

```js
import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  }),
  { ignores: ['.next/**', 'node_modules/**', 'src/payload-types.ts', 'src/migrations/**'] },
]
```

Add `@eslint/eslintrc` to devDependencies if not present (`pnpm add -D @eslint/eslintrc`).

- [ ] **Step 2: `prettier.config.mjs`**

```js
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
```

- [ ] **Step 3: `.prettierignore`**

```
.next
node_modules
pnpm-lock.yaml
src/payload-types.ts
src/migrations
public/media
```

- [ ] **Step 4: `.eslintignore`** (legacy fallback for IDE plugins)

```
.next
node_modules
src/payload-types.ts
src/migrations
```

- [ ] **Step 5: `tailwind.config.mjs`**

```js
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false, // avoid conflicts with Payload admin styles
  },
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography, animate],
}
```

- [ ] **Step 6: `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Commit**

```bash
git add eslint.config.mjs prettier.config.mjs .prettierignore .eslintignore tailwind.config.mjs postcss.config.js
git commit -m "chore: add eslint, prettier, tailwind configs"
```

---

### Task 3: Next.js base files + minimal app structure

**Files:**
- Create: `next.config.js`
- Create: `src/environment.d.ts`
- Create: `src/middleware.ts`
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/app/(frontend)/page.tsx`
- Create: `src/app/(frontend)/globals.css`
- Create: `src/app/(frontend)/not-found.tsx`

- [ ] **Step 1: `next.config.js`**

```js
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // narrow this in production
    ],
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
```

- [ ] **Step 2: `src/environment.d.ts`**

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    PAYLOAD_SECRET: string
    DATABASE_URL: string
    NEXT_PUBLIC_SERVER_URL: string
    NEXT_PUBLIC_CDN_URL?: string
    PREVIEW_SECRET?: string
    NODE_ENV: 'development' | 'production' | 'test'

    // Storage
    S3_BUCKET?: string
    S3_REGION?: string
    S3_ACCESS_KEY_ID?: string
    S3_SECRET_ACCESS_KEY?: string
    S3_ENDPOINT?: string
    GCS_BUCKET?: string
    GOOGLE_APPLICATION_CREDENTIALS?: string
    BLOB_READ_WRITE_TOKEN?: string

    // Email
    RESEND_API_KEY?: string
    SMTP_HOST?: string
    SMTP_PORT?: string
    SMTP_USER?: string
    SMTP_PASSWORD?: string
    SENDGRID_API_KEY?: string
  }
}
```

- [ ] **Step 3: `src/middleware.ts`** (placeholder, gets i18n logic in Phase 8)

```ts
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|admin|favicon.ico).*)'],
}
```

- [ ] **Step 4: `src/app/(frontend)/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 5: `src/app/(frontend)/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Payload Starter',
  description: 'Payload + Next.js starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: `src/app/(frontend)/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Payload Starter</h1>
      <p>Phase 0 boot OK. Visit <a href="/admin">/admin</a> after Phase 3.</p>
    </main>
  )
}
```

- [ ] **Step 7: `src/app/(frontend)/not-found.tsx`**

```tsx
export default function NotFound() {
  return (
    <main style={{ padding: 40 }}>
      <h1>404</h1>
      <p>Page not found.</p>
    </main>
  )
}
```

- [ ] **Step 8: Verify boot**

```bash
pnpm dev
```

Expected: visit `http://localhost:3000/`, see "Payload Starter — Phase 0 boot OK." Stop with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add next.config.js src/
git commit -m "feat: add Next.js base layout and home page"
```

---

### Task 4: Vitest + Playwright configs (skeleton)

**Files:**
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: `vitest.config.mts`**

```ts
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
  },
})
```

- [ ] **Step 2: `vitest.setup.ts`**

```ts
import '@testing-library/react'
```

- [ ] **Step 3: `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add vitest.config.mts vitest.setup.ts playwright.config.ts
git commit -m "chore: add vitest and playwright configs"
```

**Phase 0 Checkpoint:** `pnpm install`, `pnpm dev` shows the home page. `pnpm test:unit` runs (no tests yet, exits 0).

---

## Phase 1 — Central Config

### Task 5: `StarterConfig` types

**Files:**
- Create: `src/starter/types.ts`

- [ ] **Step 1: Write `src/starter/types.ts`**

```ts
export type DatabaseProvider = 'postgres' | 'sqlite'
export type StorageProvider = 'local' | 's3' | 'gcs' | 'vercel-blob'
export type EmailProvider = 'console' | 'resend' | 'smtp' | 'sendgrid'

export interface DatabaseConfig {
  provider: DatabaseProvider
}

export interface StorageConfig {
  provider: StorageProvider
}

export interface CdnConfig {
  url?: string
}

export interface EmailConfig {
  provider: EmailProvider
  from: string
}

export interface I18nConfig {
  locales: string[]
  defaultLocale: string
  /** Field paths in form `<collectionSlug>.<fieldName>` to skip during codemod. */
  skipFields?: string[]
  /** Field paths to force-mark as `localized: true`. */
  forceFields?: string[]
  /** Collection slugs to skip entirely. */
  skipCollections?: string[]
}

export interface FeaturesConfig {
  gsap: boolean
  swiper: boolean
  charts: boolean
  livePreview: boolean
  seo: boolean
  redirects: boolean
  search: boolean
  formBuilder: boolean
  nestedDocs: boolean
  importExport: boolean
  auditLog: boolean
}

export interface CollectionsConfig {
  blog: boolean
  caseStudies: boolean
  categories: boolean
  tags: boolean
}

export interface StarterConfig {
  database: DatabaseConfig
  storage: StorageConfig
  cdn?: CdnConfig
  email: EmailConfig
  i18n: I18nConfig
  features: FeaturesConfig
  collections: CollectionsConfig
}
```

- [ ] **Step 2: Commit**

```bash
git add src/starter/types.ts
git commit -m "feat(starter): add StarterConfig types"
```

---

### Task 6: `defineStarterConfig` identity helper

**Files:**
- Create: `src/starter/define.ts`
- Create: `src/starter/define.test.ts`

- [ ] **Step 1: Write failing test `src/starter/define.test.ts`**

```ts
import { describe, expect, it, expectTypeOf } from 'vitest'
import { defineStarterConfig } from './define'
import type { StarterConfig } from './types'

describe('defineStarterConfig', () => {
  it('returns the input unchanged at runtime', () => {
    const config = defineStarterConfig({
      database: { provider: 'sqlite' },
      storage: { provider: 'local' },
      email: { provider: 'console', from: 'test@example.com' },
      i18n: { locales: ['en'], defaultLocale: 'en' },
      features: {
        gsap: false, swiper: true, charts: true, livePreview: true,
        seo: true, redirects: true, search: true, formBuilder: true,
        nestedDocs: true, importExport: true, auditLog: false,
      },
      collections: { blog: true, caseStudies: true, categories: true, tags: true },
    })
    expect(config.database.provider).toBe('sqlite')
    expectTypeOf(config).toEqualTypeOf<StarterConfig>()
  })
})
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module './define'`)

```bash
pnpm test:unit -- define
```

- [ ] **Step 3: Write `src/starter/define.ts`**

```ts
import type { StarterConfig } from './types'

export function defineStarterConfig(config: StarterConfig): StarterConfig {
  return config
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit -- define
```

- [ ] **Step 5: Commit**

```bash
git add src/starter/define.ts src/starter/define.test.ts
git commit -m "feat(starter): add defineStarterConfig helper"
```

---

### Task 7: Default `starter.config.ts`

**Files:**
- Create: `starter.config.ts`

- [ ] **Step 1: Write `starter.config.ts`**

```ts
import { defineStarterConfig } from './src/starter/define'

export default defineStarterConfig({
  database: { provider: 'postgres' },
  storage: { provider: 'local' },
  cdn: { url: process.env.NEXT_PUBLIC_CDN_URL },
  email: { provider: 'console', from: 'noreply@example.com' },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    skipFields: [],
    forceFields: [],
    skipCollections: [],
  },
  features: {
    gsap: false,
    swiper: true,
    charts: true,
    livePreview: true,
    seo: true,
    redirects: true,
    search: true,
    formBuilder: true,
    nestedDocs: true,
    importExport: true,
    auditLog: false,
  },
  collections: {
    blog: true,
    caseStudies: true,
    categories: true,
    tags: true,
  },
})
```

- [ ] **Step 2: Verify import works**

```bash
pnpm tsx -e "import('./starter.config.ts').then(m => console.log(m.default.database.provider))"
```

Expected output: `postgres`

- [ ] **Step 3: Commit**

```bash
git add starter.config.ts
git commit -m "feat(starter): add default starter.config.ts"
```

**Phase 1 Checkpoint:** `starter.config.ts` is the typed source of truth. Runtime import works, types are enforced.

---

## Phase 2 — Adapters

### Task 8: DB adapter resolver

**Files:**
- Create: `src/starter/adapters/db.ts`
- Create: `src/starter/adapters/db.test.ts`

- [ ] **Step 1: Write failing test `src/starter/adapters/db.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { resolveDbAdapter } from './db'

vi.mock('@payloadcms/db-postgres', () => ({
  postgresAdapter: vi.fn((opts) => ({ __kind: 'postgres', opts })),
}))
vi.mock('@payloadcms/db-sqlite', () => ({
  sqliteAdapter: vi.fn((opts) => ({ __kind: 'sqlite', opts })),
}))

describe('resolveDbAdapter', () => {
  it('returns postgres adapter when provider is postgres', () => {
    process.env.DATABASE_URL = 'postgres://x/y'
    const a = resolveDbAdapter({ provider: 'postgres' })
    expect((a as { __kind: string }).__kind).toBe('postgres')
  })
  it('returns sqlite adapter when provider is sqlite', () => {
    process.env.DATABASE_URL = 'file:./local.db'
    const a = resolveDbAdapter({ provider: 'sqlite' })
    expect((a as { __kind: string }).__kind).toBe('sqlite')
  })
  it('throws if DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL
    expect(() => resolveDbAdapter({ provider: 'postgres' })).toThrow(/DATABASE_URL/)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit -- adapters/db
```

- [ ] **Step 3: Write `src/starter/adapters/db.ts`**

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import type { DatabaseConfig } from '../types'

export function resolveDbAdapter(config: DatabaseConfig) {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required. See .env.example.')
  }
  if (config.provider === 'postgres') {
    return postgresAdapter({
      pool: { connectionString: url },
      migrationDir: 'src/migrations',
    })
  }
  if (config.provider === 'sqlite') {
    return sqliteAdapter({
      client: { url },
      migrationDir: 'src/migrations',
    })
  }
  throw new Error(`Unsupported database provider: ${(config as { provider: string }).provider}`)
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit -- adapters/db
```

- [ ] **Step 5: Commit**

```bash
git add src/starter/adapters/db.ts src/starter/adapters/db.test.ts
git commit -m "feat(starter): add DB adapter resolver (postgres + sqlite)"
```

---

### Task 9: Storage adapter resolver

**Files:**
- Create: `src/starter/adapters/storage.ts`
- Create: `src/starter/adapters/storage.test.ts`

- [ ] **Step 1: Write failing test `src/starter/adapters/storage.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { resolveStorageAdapter } from './storage'

vi.mock('@payloadcms/storage-s3', () => ({
  s3Storage: vi.fn((opts) => ({ __kind: 's3', opts })),
}))
vi.mock('@payloadcms/storage-gcs', () => ({
  gcsStorage: vi.fn((opts) => ({ __kind: 'gcs', opts })),
}))
vi.mock('@payloadcms/storage-vercel-blob', () => ({
  vercelBlobStorage: vi.fn((opts) => ({ __kind: 'vercel', opts })),
}))

describe('resolveStorageAdapter', () => {
  it('returns null for local provider', () => {
    expect(resolveStorageAdapter({ provider: 'local' })).toBeNull()
  })
  it('returns s3 plugin for s3 provider', () => {
    process.env.S3_BUCKET = 'b'; process.env.S3_REGION = 'us-east-1'
    process.env.S3_ACCESS_KEY_ID = 'k'; process.env.S3_SECRET_ACCESS_KEY = 's'
    const a = resolveStorageAdapter({ provider: 's3' })
    expect((a as { __kind: string }).__kind).toBe('s3')
  })
  it('returns gcs plugin for gcs provider', () => {
    process.env.GCS_BUCKET = 'b'
    const a = resolveStorageAdapter({ provider: 'gcs' })
    expect((a as { __kind: string }).__kind).toBe('gcs')
  })
  it('returns vercel-blob plugin for vercel-blob provider', () => {
    process.env.BLOB_READ_WRITE_TOKEN = 't'
    const a = resolveStorageAdapter({ provider: 'vercel-blob' })
    expect((a as { __kind: string }).__kind).toBe('vercel')
  })
  it('throws when s3 env vars missing', () => {
    delete process.env.S3_BUCKET
    expect(() => resolveStorageAdapter({ provider: 's3' })).toThrow(/S3_BUCKET/)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit -- adapters/storage
```

- [ ] **Step 3: Write `src/starter/adapters/storage.ts`**

```ts
import { s3Storage } from '@payloadcms/storage-s3'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { StorageConfig } from '../types'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required when storage.provider !== 'local'`)
  return value
}

export function resolveStorageAdapter(config: StorageConfig) {
  if (config.provider === 'local') return null

  if (config.provider === 's3') {
    return s3Storage({
      collections: { media: true },
      bucket: requireEnv('S3_BUCKET'),
      config: {
        region: requireEnv('S3_REGION'),
        credentials: {
          accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
          secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
        },
        endpoint: process.env.S3_ENDPOINT, // optional, for R2/MinIO
      },
    })
  }

  if (config.provider === 'gcs') {
    return gcsStorage({
      collections: { media: true },
      bucket: requireEnv('GCS_BUCKET'),
      options: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
    })
  }

  if (config.provider === 'vercel-blob') {
    return vercelBlobStorage({
      collections: { media: true },
      token: requireEnv('BLOB_READ_WRITE_TOKEN'),
    })
  }

  throw new Error(`Unsupported storage provider: ${(config as { provider: string }).provider}`)
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit -- adapters/storage
```

- [ ] **Step 5: Commit**

```bash
git add src/starter/adapters/storage.ts src/starter/adapters/storage.test.ts
git commit -m "feat(starter): add storage adapter resolver (local/s3/gcs/vercel-blob)"
```

---

### Task 10: Email adapter resolver

**Files:**
- Create: `src/starter/adapters/email.ts`
- Create: `src/starter/adapters/email.test.ts`

- [ ] **Step 1: Write failing test `src/starter/adapters/email.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { resolveEmailAdapter } from './email'

vi.mock('@payloadcms/email-resend', () => ({
  resendAdapter: vi.fn((opts) => ({ __kind: 'resend', opts })),
}))
vi.mock('@payloadcms/email-nodemailer', () => ({
  nodemailerAdapter: vi.fn((opts) => ({ __kind: 'nodemailer', opts })),
}))

describe('resolveEmailAdapter', () => {
  const baseCfg = { from: 'test@example.com' as const }

  it('returns console adapter for console provider', async () => {
    const adapter = resolveEmailAdapter({ ...baseCfg, provider: 'console' })
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await adapter.sendEmail({ to: 'x@y.z', subject: 'hi', html: '<p>body</p>' })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('returns resend adapter for resend provider', () => {
    process.env.RESEND_API_KEY = 'k'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'resend' })
    expect((a as { __kind: string }).__kind).toBe('resend')
  })

  it('returns nodemailer adapter for smtp provider', () => {
    process.env.SMTP_HOST = 'h'; process.env.SMTP_USER = 'u'
    process.env.SMTP_PASSWORD = 'p'; process.env.SMTP_PORT = '587'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'smtp' })
    expect((a as { __kind: string }).__kind).toBe('nodemailer')
  })

  it('returns nodemailer adapter for sendgrid provider', () => {
    process.env.SENDGRID_API_KEY = 'k'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'sendgrid' })
    expect((a as { __kind: string }).__kind).toBe('nodemailer')
  })

  it('throws when resend api key missing', () => {
    delete process.env.RESEND_API_KEY
    expect(() => resolveEmailAdapter({ ...baseCfg, provider: 'resend' })).toThrow(/RESEND_API_KEY/)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit -- adapters/email
```

- [ ] **Step 3: Write `src/starter/adapters/email.ts`**

```ts
import { resendAdapter } from '@payloadcms/email-resend'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { EmailConfig } from '../types'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required for email provider`)
  return value
}

export function resolveEmailAdapter(config: EmailConfig) {
  if (config.provider === 'console') {
    // Inline adapter conforming to Payload's email adapter shape.
    return {
      name: 'console',
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      sendEmail: async (message: {
        to: string | string[]
        subject?: string
        html?: string
        text?: string
      }) => {
        // eslint-disable-next-line no-console
        console.log('[email:console]', JSON.stringify(message, null, 2))
        return { accepted: Array.isArray(message.to) ? message.to : [message.to] }
      },
    }
  }

  if (config.provider === 'resend') {
    return resendAdapter({
      apiKey: requireEnv('RESEND_API_KEY'),
      defaultFromAddress: config.from,
      defaultFromName: config.from,
    })
  }

  if (config.provider === 'smtp') {
    return nodemailerAdapter({
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      transportOptions: {
        host: requireEnv('SMTP_HOST'),
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        auth: {
          user: requireEnv('SMTP_USER'),
          pass: requireEnv('SMTP_PASSWORD'),
        },
      },
    })
  }

  if (config.provider === 'sendgrid') {
    return nodemailerAdapter({
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      transportOptions: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: requireEnv('SENDGRID_API_KEY'),
        },
      },
    })
  }

  throw new Error(`Unsupported email provider: ${(config as { provider: string }).provider}`)
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit -- adapters/email
```

- [ ] **Step 5: Commit**

```bash
git add src/starter/adapters/email.ts src/starter/adapters/email.test.ts
git commit -m "feat(starter): add email adapter resolver (console/resend/smtp/sendgrid)"
```

---

### Task 11: Plugin builder

**Files:**
- Create: `src/starter/plugins.ts`
- Create: `src/starter/plugins.test.ts`

- [ ] **Step 1: Write failing test `src/starter/plugins.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { buildPlugins } from './plugins'

vi.mock('@payloadcms/plugin-seo', () => ({ seoPlugin: vi.fn(() => ({ __k: 'seo' })) }))
vi.mock('@payloadcms/plugin-redirects', () => ({ redirectsPlugin: vi.fn(() => ({ __k: 'redirects' })) }))
vi.mock('@payloadcms/plugin-search', () => ({ searchPlugin: vi.fn(() => ({ __k: 'search' })) }))
vi.mock('@payloadcms/plugin-form-builder', () => ({ formBuilderPlugin: vi.fn(() => ({ __k: 'form' })) }))
vi.mock('@payloadcms/plugin-nested-docs', () => ({ nestedDocsPlugin: vi.fn(() => ({ __k: 'nested' })) }))
vi.mock('@payloadcms/plugin-import-export', () => ({ importExportPlugin: vi.fn(() => ({ __k: 'ie' })) }))

const allOn = {
  gsap: false, swiper: false, charts: false, livePreview: false, auditLog: false,
  seo: true, redirects: true, search: true, formBuilder: true, nestedDocs: true, importExport: true,
}

describe('buildPlugins', () => {
  it('includes all plugins when all toggles are on', () => {
    const plugins = buildPlugins(allOn)
    const kinds = plugins.map((p) => (p as { __k: string }).__k)
    expect(kinds).toEqual(expect.arrayContaining(['seo', 'redirects', 'search', 'form', 'nested', 'ie']))
  })
  it('omits a plugin when its toggle is off', () => {
    const plugins = buildPlugins({ ...allOn, seo: false, search: false })
    const kinds = plugins.map((p) => (p as { __k: string }).__k)
    expect(kinds).not.toContain('seo')
    expect(kinds).not.toContain('search')
    expect(kinds).toContain('redirects')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit -- plugins
```

- [ ] **Step 3: Write `src/starter/plugins.ts`**

```ts
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
    plugins.push(seoPlugin({
      collections: ['pages', 'blog', 'case-studies'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title ?? 'Untitled'}`,
    }))
  }

  if (features.redirects) {
    plugins.push(redirectsPlugin({
      collections: ['pages', 'blog', 'case-studies'],
    }))
  }

  if (features.search) {
    plugins.push(searchPlugin({
      collections: ['pages', 'blog', 'case-studies'],
      defaultPriorities: { pages: 10, blog: 20, 'case-studies': 30 },
    }))
  }

  if (features.formBuilder) {
    plugins.push(formBuilderPlugin({
      fields: { payment: false }, // disable payment fields by default
    }))
  }

  if (features.nestedDocs) {
    plugins.push(nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => (doc.title as string) ?? '',
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }))
  }

  if (features.importExport) {
    plugins.push(importExportPlugin({
      collections: ['pages', 'blog', 'case-studies', 'media'],
    }))
  }

  return plugins
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit -- plugins
```

- [ ] **Step 5: Commit**

```bash
git add src/starter/plugins.ts src/starter/plugins.test.ts
git commit -m "feat(starter): add plugin builder (toggleable via features config)"
```

---

### Task 12: Collections builder + i18n localization helper

**Files:**
- Create: `src/starter/collections.ts`
- Create: `src/starter/i18n.ts`

Note: `buildCollections` returns a list of collection configs based on toggles. It accepts the actual collection imports (passed from `payload.config.ts`) and filters them by `starterConfig.collections`. This indirection avoids circular imports since collections themselves don't depend on `starter/`.

- [ ] **Step 1: Write `src/starter/i18n.ts`**

```ts
import type { I18nConfig } from './types'

export function resolveLocalization(config: I18nConfig) {
  if (config.locales.length <= 1) return undefined
  return {
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    fallback: true,
  }
}
```

- [ ] **Step 2: Write `src/starter/collections.ts`**

```ts
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
```

- [ ] **Step 3: Commit**

```bash
git add src/starter/collections.ts src/starter/i18n.ts
git commit -m "feat(starter): add collections builder and i18n localization helper"
```

---

### Task 13: Wire `payload.config.ts`

**Files:**
- Create: `src/payload.config.ts`

Note: Users / Media / Pages / Blog / CaseStudies / Categories / Tags collections are stubs at this point — they get filled in later phases. We need them to exist as minimal valid `CollectionConfig` objects so `payload.config.ts` boots.

- [ ] **Step 1: Create stub collections** (minimal valid configs to be replaced in Phases 3, 5, 7)

```bash
mkdir -p src/collections/Pages src/collections/Blog src/collections/CaseStudies
```

`src/collections/Users.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [],
}
```

`src/collections/Media.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Media: CollectionConfig = {
  slug: 'media',
  upload: { staticDir: 'public/media' },
  fields: [{ name: 'alt', type: 'text' }],
}
```

`src/collections/Pages/index.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
```

`src/collections/Blog/index.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Blog: CollectionConfig = {
  slug: 'blog',
  fields: [{ name: 'title', type: 'text', required: true }],
}
```

`src/collections/CaseStudies/index.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  fields: [{ name: 'title', type: 'text', required: true }],
}
```

`src/collections/Categories.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [{ name: 'title', type: 'text', required: true }],
}
```

`src/collections/Tags.ts`:
```ts
import type { CollectionConfig } from 'payload'
export const Tags: CollectionConfig = {
  slug: 'tags',
  fields: [{ name: 'title', type: 'text', required: true }],
}
```

- [ ] **Step 2: Write `src/payload.config.ts`**

```ts
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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
      ? { url: ({ data, collectionConfig }) => {
          const slug = (data?.slug as string) ?? ''
          const base = collectionConfig?.slug === 'pages' ? '' : `/${collectionConfig?.slug}`
          return `${process.env.NEXT_PUBLIC_SERVER_URL}${base}/${slug}?preview=${process.env.PREVIEW_SECRET ?? ''}`
        } }
      : undefined,
  },
  editor: lexicalEditor({}),
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
```

- [ ] **Step 3: Commit**

```bash
git add src/payload.config.ts src/collections/
git commit -m "feat: wire payload.config.ts to read starter.config.ts"
```

**Phase 2 Checkpoint:** `payload.config.ts` boots, adapter functions are unit-tested. (Full admin/frontend boot happens in Phase 3 once Payload routes are added.)

---

## Phase 3 — Core Collections + Admin Routes

### Task 14: Access functions

**Files:**
- Create: `src/access/isAdmin.ts`
- Create: `src/access/isAdminOrEditor.ts`

- [ ] **Step 1: `src/access/isAdmin.ts`**

```ts
import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req }) => {
  return Boolean(req.user && (req.user as { role?: string }).role === 'admin')
}

export const isAdminFieldLevel: FieldAccess = ({ req }) => {
  return Boolean(req.user && (req.user as { role?: string }).role === 'admin')
}
```

- [ ] **Step 2: `src/access/isAdminOrEditor.ts`**

```ts
import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req }) => {
  if (!req.user) return false
  const role = (req.user as { role?: string }).role
  return role === 'admin' || role === 'editor'
}
```

- [ ] **Step 3: Commit**

```bash
git add src/access/
git commit -m "feat(access): add isAdmin and isAdminOrEditor helpers"
```

---

### Task 15: Users collection (full)

**Files:**
- Modify: `src/collections/Users.ts`

- [ ] **Step 1: Replace `src/collections/Users.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: ({ req }) => (req.user as { role?: string })?.role === 'admin' },
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/collections/Users.ts
git commit -m "feat(users): add roles, admin access controls"
```

---

### Task 16: Media collection (full)

**Files:**
- Modify: `src/collections/Media.ts`

- [ ] **Step 1: Replace `src/collections/Media.ts`**

```ts
import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    { name: 'alt', type: 'text', required: false },
    { name: 'caption', type: 'text' },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/collections/Media.ts
git commit -m "feat(media): add upload sizes, mime types, access controls"
```

---

### Task 17: Payload admin & API route handlers

**Files:**
- Create: `src/app/(payload)/layout.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Create: `src/app/(payload)/api/graphql/route.ts`
- Create: `src/app/(payload)/api/graphql-playground/route.ts`
- Create: `src/app/(payload)/custom.scss` (Payload admin global override)

- [ ] **Step 1: `src/app/(payload)/layout.tsx`**

```tsx
import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import './custom.scss'
import { importMap } from './admin/[[...segments]]/importMap.js'

type Args = { children: React.ReactNode }

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
```

- [ ] **Step 2: `src/app/(payload)/admin/[[...segments]]/page.tsx`**

```tsx
import config from '@payload-config'
import type { Metadata } from 'next'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from './importMap.js'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
```

- [ ] **Step 3: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`**

```tsx
import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import { importMap } from './importMap.js'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
```

- [ ] **Step 4: Generate the importmap**

```bash
pnpm generate:importmap
```

This creates `src/app/(payload)/admin/[[...segments]]/importMap.js`.

- [ ] **Step 5: `src/app/(payload)/api/[...slug]/route.ts`**

```ts
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

- [ ] **Step 6: `src/app/(payload)/api/graphql/route.ts`**

```ts
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)
export const OPTIONS = REST_OPTIONS(config)
```

- [ ] **Step 7: `src/app/(payload)/api/graphql-playground/route.ts`**

```ts
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

- [ ] **Step 8: `src/app/(payload)/custom.scss`**

```scss
/* Custom Payload admin overrides go here */
```

- [ ] **Step 9: Bring up Postgres for development**

Use whichever local Postgres works for you (Docker, Postgres.app, Homebrew). Quick Docker:

```bash
docker run --name payload-starter-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=payload_starter -p 5432:5432 -d postgres:16
```

Set `.env`:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/payload_starter
PAYLOAD_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Note: don't commit `.env`. It's in `.gitignore`.

- [ ] **Step 10: Generate types and run initial migration**

```bash
pnpm generate:types
pnpm migrate:create --name=initial
pnpm migrate
```

Expected: `src/payload-types.ts` created, migration file in `src/migrations/`, DB schema applied.

- [ ] **Step 11: Boot and verify**

```bash
pnpm dev
```

Visit `http://localhost:3000/admin` — Payload prompts to create the first admin user. Create `admin@example.com` / `admin1234`. After login, the admin shows Users, Media, Pages, Blog, CaseStudies, Categories, Tags collections.

Stop with Ctrl+C.

- [ ] **Step 12: Commit**

```bash
git add src/app/\(payload\) src/migrations src/payload-types.ts
git commit -m "feat: wire Payload admin and API routes; initial migration"
```

**Phase 3 Checkpoint:** `/admin` is reachable, login works, all stub collections appear. Media uploads work (try uploading any image).

---

## Phase 4 — Lexical Editor

### Task 18: `defaultLexical` preset

**Files:**
- Create: `src/fields/defaultLexical.ts`

- [ ] **Step 1: Write `src/fields/defaultLexical.ts`**

```ts
import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => {
        const withoutUrl = defaultFields.filter((f) => !('name' in f && f.name === 'url'))
        return [
          ...withoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_d, sib) => sib?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
```

- [ ] **Step 2: Commit**

```bash
git add src/fields/defaultLexical.ts
git commit -m "feat(fields): add defaultLexical editor preset"
```

---

### Task 19: Highlight feature (custom Lexical example)

**Files:**
- Create: `src/features/highlight/feature.server.ts`
- Create: `src/features/highlight/feature.client.tsx`
- Create: `src/features/highlight/components/HighlightNode.ts`

- [ ] **Step 1: `src/features/highlight/components/HighlightNode.ts`**

```ts
import { TextNode, type SerializedTextNode, type LexicalNode, type EditorConfig } from 'lexical'

export type SerializedHighlightNode = SerializedTextNode & { type: 'highlight' }

export class HighlightNode extends TextNode {
  static getType(): string { return 'highlight' }
  static clone(node: HighlightNode): HighlightNode { return new HighlightNode(node.__text, node.__key) }

  createDOM(config: EditorConfig): HTMLElement {
    const el = super.createDOM(config)
    el.style.backgroundColor = 'yellow'
    el.style.padding = '0 2px'
    return el
  }

  static importJSON(json: SerializedHighlightNode): HighlightNode {
    return new HighlightNode(json.text)
  }

  exportJSON(): SerializedHighlightNode {
    return { ...super.exportJSON(), type: 'highlight', version: 1 }
  }
}

export function $createHighlightNode(text: string): HighlightNode {
  return new HighlightNode(text)
}

export function $isHighlightNode(node: LexicalNode | null | undefined): node is HighlightNode {
  return node instanceof HighlightNode
}
```

- [ ] **Step 2: `src/features/highlight/feature.server.ts`**

```ts
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const HighlightFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/highlight/feature.client#HighlightFeatureClient',
    nodes: [
      {
        node: '@/features/highlight/components/HighlightNode#HighlightNode',
      },
    ],
  },
  key: 'highlight',
})
```

- [ ] **Step 3: `src/features/highlight/feature.client.tsx`**

```tsx
'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { HighlightNode, $createHighlightNode, $isHighlightNode } from './components/HighlightNode'
import { $getSelection, $isRangeSelection } from 'lexical'
import type { ToolbarGroup } from '@payloadcms/richtext-lexical'

const toolbarGroup: ToolbarGroup = {
  type: 'buttons',
  key: 'highlight',
  items: [
    {
      ChildComponent: () => <span style={{ background: 'yellow', padding: '0 4px' }}>H</span>,
      key: 'highlight',
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return
          const text = selection.getTextContent()
          if (!text) return
          const node = $createHighlightNode(text)
          selection.insertNodes([node])
        })
      },
    },
  ],
}

export const HighlightFeatureClient = createClientFeature({
  nodes: [HighlightNode],
  toolbarFixed: { groups: [toolbarGroup] },
  toolbarInline: { groups: [toolbarGroup] },
})

export { $createHighlightNode, $isHighlightNode }
```

- [ ] **Step 4: Commit**

```bash
git add src/features/highlight/
git commit -m "feat(lexical): add highlight feature as custom-feature reference"
```

---

### Task 20: `wideMarkupLexical` preset

**Files:**
- Create: `src/fields/wideMarkupLexical.ts`

- [ ] **Step 1: Write `src/fields/wideMarkupLexical.ts`**

```ts
import type { TextFieldSingleValidation } from 'payload'
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { HighlightFeature } from '@/features/highlight/feature.server'

export const wideMarkupLexical = lexicalEditor({
  features: ({ rootFeatures }) => {
    const filtered = rootFeatures.filter((f) => {
      if (!f || typeof f !== 'object' || !('key' in f)) return true
      return !['paragraph', 'heading', 'blockquote', 'list', 'table'].includes(f.key as string)
    })

    return [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlockquoteFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      EXPERIMENTAL_TableFeature(),
      ...filtered,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      InlineCodeFeature(),
      AlignFeature(),
      IndentFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'blog', 'case-studies'],
        fields: ({ defaultFields }) => {
          const withoutUrl = defaultFields.filter((f) => !('name' in f && f.name === 'url'))
          return [
            ...withoutUrl,
            {
              name: 'url',
              type: 'text',
              admin: { condition: (_d, sib) => sib?.linkType !== 'internal' },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
              validate: ((value, options) => {
                if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
                return value ? true : 'URL is required'
              }) as TextFieldSingleValidation,
            },
          ]
        },
      }),
      RelationshipFeature({ enabledCollections: ['pages', 'blog', 'case-studies'] }),
      UploadFeature({
        collections: {
          media: {
            fields: [{ name: 'altText', type: 'text', label: 'Alt text override' }],
          },
        },
      }),
      HorizontalRuleFeature(),
      TextStateFeature({
        state: {
          color: {
            primary: { label: 'Primary', css: { color: '#0066FF' } },
            success: { label: 'Success', css: { color: '#00C853' } },
            warning: { label: 'Warning', css: { color: '#FF9100' } },
            danger: { label: 'Danger', css: { color: '#D32F2F' } },
            muted: { label: 'Muted', css: { color: '#9E9E9E' } },
          },
        },
      }),
      HighlightFeature(),
    ]
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/fields/wideMarkupLexical.ts
git commit -m "feat(fields): add wideMarkupLexical preset with highlight feature"
```

---

### Task 21: Slug + Link field helpers

**Files:**
- Create: `src/fields/slug.ts`
- Create: `src/fields/link.ts`

- [ ] **Step 1: `src/fields/slug.ts`**

```ts
import type { Field, FieldHook } from 'payload'

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug = (fallback: string): FieldHook => ({ data, value, originalDoc }) => {
  if (typeof value === 'string' && value.length > 0) return slugify(value)
  const source = data?.[fallback] ?? originalDoc?.[fallback]
  return typeof source === 'string' ? slugify(source) : value
}

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier (auto-generated from ' + sourceField + ' if blank)',
  },
  hooks: { beforeValidate: [formatSlug(sourceField)] },
})
```

- [ ] **Step 2: `src/fields/link.ts`**

```ts
import type { Field, GroupField } from 'payload'

export const linkField = (overrides?: Partial<GroupField>): Field => ({
  type: 'group',
  name: 'link',
  ...overrides,
  fields: [
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'reference',
      options: [
        { label: 'Internal', value: 'reference' },
        { label: 'External URL', value: 'custom' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'blog', 'case-studies'],
      required: true,
      admin: { condition: (_d, sib) => sib?.type === 'reference' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { condition: (_d, sib) => sib?.type === 'custom' },
    },
    { name: 'label', type: 'text', required: true },
    { name: 'newTab', type: 'checkbox', label: 'Open in new tab' },
  ],
})
```

- [ ] **Step 3: Update payload.config.ts editor to wide preset**

Replace the editor line in `src/payload.config.ts`:
```ts
editor: lexicalEditor({}),
```
with:
```ts
import { wideMarkupLexical } from './fields/wideMarkupLexical'
// ...
editor: wideMarkupLexical,
```

- [ ] **Step 4: Regenerate types and verify boot**

```bash
pnpm generate:types
pnpm dev
```

Expected: admin loads, the global rich-text editor (visible later in Pages content) shows the full toolbar including the yellow "H" highlight button. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/fields/slug.ts src/fields/link.ts src/payload.config.ts src/payload-types.ts
git commit -m "feat(fields): add slug + link helpers; switch global editor to wideMarkupLexical"
```

**Phase 4 Checkpoint:** Both Lexical presets exist; the highlight feature is functional in admin.

---

## Phase 5 — Pages, RenderBlocks, First Block (Hero)

### Task 22: Block placeholder PNGs

**Files:**
- Create: `public/blocks/{hero,call-to-action,rich-text-block,media-with-text,content-media,text-columns,feature-grid,image-grid,logo-cloud,testimonials,faq,stats,stats-chart}.png`

- [ ] **Step 1: Generate placeholder PNGs**

A small Node script `scripts/gen-block-placeholders.ts` (one-off) writes a 200×120 PNG with the block name centered. Use `sharp` (already a dep) for image generation:

```ts
// scripts/gen-block-placeholders.ts
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

const BLOCKS = [
  'hero', 'call-to-action', 'rich-text-block', 'media-with-text', 'content-media',
  'text-columns', 'feature-grid', 'image-grid', 'logo-cloud', 'testimonials',
  'faq', 'stats', 'stats-chart',
]

const dir = path.resolve('public/blocks')
await fs.mkdir(dir, { recursive: true })

for (const slug of BLOCKS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120">
    <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ccc"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#444"
          text-anchor="middle" dominant-baseline="middle">${slug}</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, `${slug}.png`))
  console.log('wrote', slug + '.png')
}
```

Run:
```bash
pnpm tsx scripts/gen-block-placeholders.ts
```

- [ ] **Step 2: Commit**

```bash
git add public/blocks scripts/gen-block-placeholders.ts
git commit -m "chore: add block placeholder PNGs"
```

---

### Task 23: Hero block (canonical pattern; all other blocks follow this shape)

**Files:**
- Create: `src/blocks/Hero/config.ts`
- Create: `src/blocks/Hero/Component.tsx`

- [ ] **Step 1: `src/blocks/Hero/config.ts`**

```ts
import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { linkField } from '@/fields/link'

export const Hero: Block = {
  slug: 'hero',
  imageURL: '/blocks/hero.png',
  imageAltText: 'Hero block — heading + subheading + CTA + optional bg media',
  admin: { group: 'Hero & CTA' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'richText', editor: defaultLexical },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'image' },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'video' },
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: `src/blocks/Hero/Component.tsx`**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

type HeroBlock = Extract<NonNullable<Page['blocks']>[number], { blockType: 'hero' }>

export function HeroBlock({ block }: { block: HeroBlock }) {
  const bg = block.background
  const bgImage = typeof bg?.image === 'object' && bg.image ? bg.image.url : undefined
  const bgVideo = typeof bg?.video === 'object' && bg.video ? bg.video.url : undefined

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center text-center px-6 py-20"
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {bg?.type === 'video' && bgVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          src={bgVideo}
        />
      )}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{block.heading}</h1>
        {block.subheading && (
          <div className="text-lg md:text-xl mb-8 opacity-90">
            <RichText data={block.subheading} />
          </div>
        )}
        {block.ctas && block.ctas.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {block.ctas.map((cta, i) => {
              const link = cta.link
              const href =
                link?.type === 'reference' && typeof link.reference?.value === 'object'
                  ? `/${link.reference.value.slug ?? ''}`
                  : link?.url ?? '#'
              return (
                <Link
                  key={i}
                  href={href}
                  target={link?.newTab ? '_blank' : undefined}
                  className="inline-block px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {link?.label ?? 'Learn more'}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/blocks/Hero/
git commit -m "feat(blocks): add Hero block (canonical pattern reference)"
```

---

### Task 24: Pages collection (full)

**Files:**
- Modify: `src/collections/Pages/index.ts`
- Create: `src/collections/Pages/access.ts`

- [ ] **Step 1: `src/collections/Pages/access.ts`**

```ts
import type { Access } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const pagesReadAccess: Access = ({ req }) => {
  if (req.user && (['admin', 'editor'] as const).includes((req.user as { role: string }).role as 'admin' | 'editor')) return true
  return { _status: { equals: 'published' } }
}

export const pagesWriteAccess = isAdminOrEditor
```

- [ ] **Step 2: Replace `src/collections/Pages/index.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { Hero } from '@/blocks/Hero/config'
import { pagesReadAccess, pagesWriteAccess } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: pagesReadAccess,
    create: pagesWriteAccess,
    update: pagesWriteAccess,
    delete: pagesWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'blocks',
              type: 'blocks',
              minRows: 0,
              blocks: [Hero], // remaining 12 blocks added in Phase 6
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
```

- [ ] **Step 3: Regenerate types + create migration**

```bash
pnpm generate:types
pnpm migrate:create --name=pages-with-hero
pnpm migrate
```

- [ ] **Step 4: Commit**

```bash
git add src/collections/Pages/ src/payload-types.ts src/migrations
git commit -m "feat(pages): add full Pages collection with drafts and Hero block"
```

---

### Task 25: RenderBlocks + dynamic [slug] page

**Files:**
- Create: `src/blocks/RenderBlocks.tsx`
- Create: `src/utilities/getPageBySlug.ts`
- Create: `src/app/(frontend)/[slug]/page.tsx`
- Modify: `src/app/(frontend)/page.tsx` to render the home page

- [ ] **Step 1: `src/blocks/RenderBlocks.tsx`**

```tsx
import type { Page } from '@/payload-types'
import { HeroBlock } from './Hero/Component'

type Block = NonNullable<Page['blocks']>[number]

const components: Record<string, React.ComponentType<{ block: any }>> = {
  hero: HeroBlock,
  // additional blocks registered in Phase 6
}

export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = components[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return <Component key={i} block={block} />
      })}
    </>
  )
}
```

- [ ] **Step 2: `src/utilities/getPageBySlug.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Page } from '@/payload-types'

async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as Page) ?? null
}

export const getPageBySlug = (slug: string) =>
  unstable_cache(
    () => fetchPageBySlug(slug),
    ['page', slug],
    { tags: [`page:${slug}`], revalidate: 60 },
  )()
```

- [ ] **Step 3: `src/app/(frontend)/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'

type Props = { params: Promise<{ slug: string }> }

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return { title: page.title }
}
```

- [ ] **Step 4: Replace `src/app/(frontend)/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function HomePage() {
  const page = await getPageBySlug('home')
  if (!page) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Payload Starter</h1>
        <p>No "home" page yet. Run <code>pnpm seed</code> after Phase 11 or create one in <a href="/admin/collections/pages">/admin/collections/pages</a>.</p>
      </main>
    )
  }
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}
```

- [ ] **Step 5: Test in admin**

```bash
pnpm dev
```

In `/admin`, create a new Page with slug `home`, add a Hero block (heading "Welcome"), publish. Visit `http://localhost:3000/` — Hero renders.

- [ ] **Step 6: Commit**

```bash
git add src/blocks/RenderBlocks.tsx src/utilities/getPageBySlug.ts src/app/\(frontend\)
git commit -m "feat(frontend): add RenderBlocks and dynamic [slug] page route"
```

**Phase 5 Checkpoint:** Pages can be created in admin with Hero blocks; they render at `/` (when slug is `home`) and `/[slug]`.

---

## Phase 6 — All 13 Blocks

**Pattern reminder for every block in this phase:**
1. `src/blocks/<Name>/config.ts` — Payload `Block` with `slug`, `imageURL: '/blocks/<slug>.png'`, `imageAltText`, `admin.group`, `fields`.
2. `src/blocks/<Name>/Component.tsx` — React server component (or client when needed) consuming the typed block from `@/payload-types`.
3. Register in `src/blocks/RenderBlocks.tsx` (`components` map) — done once at the end of this phase.
4. Register in `src/collections/Pages/index.ts` `blocks` array — done once at the end.

The Component for each block is intentionally minimal (Tailwind utility classes, no design polish). Designers refine later.

### Task 26: CallToAction block

**Files:** `src/blocks/CallToAction/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { linkField } from '@/fields/link'

export const CallToAction: Block = {
  slug: 'call-to-action',
  imageURL: '/blocks/call-to-action.png',
  imageAltText: 'CTA — heading + description + buttons',
  admin: { group: 'Hero & CTA' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'richText', editor: defaultLexical },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'call-to-action' }>

export function CallToActionBlock({ block }: { block: Block }) {
  return (
    <section className="px-6 py-16 text-center bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{block.heading}</h2>
        {block.description && (
          <div className="mb-6"><RichText data={block.description} /></div>
        )}
        {block.buttons && block.buttons.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {block.buttons.map((btn, i) => {
              const link = btn.link
              const href = link?.type === 'reference' && typeof link.reference?.value === 'object'
                ? `/${link.reference.value.slug ?? ''}` : link?.url ?? '#'
              return (
                <Link key={i} href={href} target={link?.newTab ? '_blank' : undefined}
                      className="inline-block px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700">
                  {link?.label ?? 'Learn more'}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/CallToAction && git commit -m "feat(blocks): add CallToAction"`

---

### Task 27: RichTextBlock

**Files:** `src/blocks/RichTextBlock/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const RichTextBlock: Block = {
  slug: 'rich-text-block',
  imageURL: '/blocks/rich-text-block.png',
  imageAltText: 'Rich text — full editor including media, tables, highlight',
  admin: { group: 'Content' },
  fields: [
    { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Narrow (prose)', value: 'prose' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'rich-text-block' }>

const widths = { prose: 'max-w-prose', wide: 'max-w-5xl', full: 'max-w-none' }

export function RichTextBlockComponent({ block }: { block: Block }) {
  return (
    <section className="px-6 py-12">
      <div className={`mx-auto prose prose-lg ${widths[block.maxWidth ?? 'prose']}`}>
        <RichText data={block.content} />
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/RichTextBlock && git commit -m "feat(blocks): add RichTextBlock"`

---

### Task 28: MediaWithText

**Files:** `src/blocks/MediaWithText/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const MediaWithText: Block = {
  slug: 'media-with-text',
  imageURL: '/blocks/media-with-text.png',
  imageAltText: 'Media + text, left or right',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
    {
      name: 'media',
      type: 'group',
      fields: [
        { name: 'type', type: 'select', defaultValue: 'image',
          options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }] },
        { name: 'image', type: 'upload', relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'image' } },
        { name: 'video', type: 'upload', relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'video' } },
      ],
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'media-with-text' }>

export function MediaWithTextBlock({ block }: { block: Block }) {
  const m = block.media
  const img = m?.type === 'image' && typeof m.image === 'object' ? m.image : null
  const vid = m?.type === 'video' && typeof m.video === 'object' ? m.video : null
  const reverse = block.mediaPosition === 'right'

  return (
    <section className="px-6 py-12">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div>
          {img?.url && <img src={img.url} alt={img.alt ?? ''} className="w-full rounded" />}
          {vid?.url && <video src={vid.url} controls className="w-full rounded" />}
        </div>
        <div>
          {block.heading && <h2 className="text-3xl font-bold mb-4">{block.heading}</h2>}
          <div className="prose"><RichText data={block.content} /></div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/MediaWithText && git commit -m "feat(blocks): add MediaWithText"`

---

### Task 29: ContentMedia (alternating sections)

**Files:** `src/blocks/ContentMedia/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const ContentMedia: Block = {
  slug: 'content-media',
  imageURL: '/blocks/content-media.png',
  imageAltText: 'Multiple alternating media+text sections',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText', editor: wideMarkupLexical },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'content-media' }>

export function ContentMediaBlock({ block }: { block: Block }) {
  return (
    <section className="px-6 py-12">
      {block.heading && <h2 className="text-3xl font-bold text-center mb-12 max-w-6xl mx-auto">{block.heading}</h2>}
      <div className="max-w-6xl mx-auto space-y-16">
        {block.sections?.map((section, i) => {
          const img = typeof section.image === 'object' ? section.image : null
          const reverse = i % 2 === 1
          return (
            <div key={i} className={`grid md:grid-cols-2 gap-8 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>{img?.url && <img src={img.url} alt={img.alt ?? ''} className="w-full rounded" />}</div>
              <div>
                {section.heading && <h3 className="text-2xl font-semibold mb-3">{section.heading}</h3>}
                {section.content && <div className="prose"><RichText data={section.content} /></div>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/ContentMedia && git commit -m "feat(blocks): add ContentMedia"`

---

### Task 30: TextColumns (N columns of rich text)

**Files:** `src/blocks/TextColumns/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const TextColumns: Block = {
  slug: 'text-columns',
  imageURL: '/blocks/text-columns.png',
  imageAltText: 'Text in N columns',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText', editor: wideMarkupLexical },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'text-columns' }>

const cols = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3', '4': 'md:grid-cols-4' } as const

export function TextColumnsBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns ?? '2') as keyof typeof cols]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>}
        <div className={`grid gap-8 ${colClass}`}>
          {block.items?.map((item, i) => (
            <div key={i}>
              {item.heading && <h3 className="text-xl font-semibold mb-2">{item.heading}</h3>}
              {item.content && <div className="prose prose-sm"><RichText data={item.content} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/TextColumns && git commit -m "feat(blocks): add TextColumns"`

---

### Task 31: FeatureGrid (icon cards)

**Files:** `src/blocks/FeatureGrid/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'feature-grid',
  imageURL: '/blocks/feature-grid.png',
  imageAltText: 'Feature cards in 2/3/4 columns',
  admin: { group: 'Lists & Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'feature-grid' }>

const cols = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3', '4': 'md:grid-cols-4' } as const

export function FeatureGridBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns ?? '3') as keyof typeof cols]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-2">{block.heading}</h2>}
        {block.subheading && <p className="text-center text-gray-600 mb-10">{block.subheading}</p>}
        <div className={`grid gap-8 ${colClass}`}>
          {block.items?.map((item, i) => {
            const icon = typeof item.icon === 'object' ? item.icon : null
            return (
              <div key={i} className="text-center">
                {icon?.url && <img src={icon.url} alt={icon.alt ?? ''} className="w-12 h-12 mx-auto mb-3" />}
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/FeatureGrid && git commit -m "feat(blocks): add FeatureGrid"`

---

### Task 32: ImageGrid (gallery)

**Files:** `src/blocks/ImageGrid/{config.ts,Component.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const ImageGrid: Block = {
  slug: 'image-grid',
  imageURL: '/blocks/image-grid.png',
  imageAltText: 'Image gallery in 2/3/4/6 columns',
  admin: { group: 'Lists & Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' }, { label: '3', value: '3' },
        { label: '4', value: '4' }, { label: '6', value: '6' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'image-grid' }>

const cols = {
  '2': 'md:grid-cols-2', '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4', '6': 'md:grid-cols-6',
} as const

export function ImageGridBlock({ block }: { block: Block }) {
  const colClass = cols[(block.columns ?? '3') as keyof typeof cols]
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>}
        <div className={`grid gap-4 grid-cols-2 ${colClass}`}>
          {block.images?.map((item, i) => {
            const img = typeof item.image === 'object' ? item.image : null
            if (!img?.url) return null
            return (
              <figure key={i}>
                <img src={img.url} alt={img.alt ?? item.caption ?? ''} className="w-full h-auto rounded" />
                {item.caption && <figcaption className="text-sm text-gray-500 mt-1 text-center">{item.caption}</figcaption>}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/ImageGrid && git commit -m "feat(blocks): add ImageGrid"`

---

### Task 33: LogoCloud (swiper-conditional carousel; static grid otherwise)

**Files:** `src/blocks/LogoCloud/{config.ts,Component.tsx,Component.client.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const LogoCloud: Block = {
  slug: 'logo-cloud',
  imageURL: '/blocks/logo-cloud.png',
  imageAltText: 'Partner / client logos',
  admin: { group: 'Lists & Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`** (server, decides whether to use carousel client based on `starter.config.ts`):

```tsx
import starterConfig from '../../../starter.config'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'logo-cloud' }>

export async function LogoCloudBlock({ block }: { block: Block }) {
  if (starterConfig.features.swiper) {
    const { LogoCloudCarousel } = await import('./Component.client')
    return <LogoCloudCarousel block={block} />
  }
  return (
    <section className="px-6 py-12">
      {block.heading && <h2 className="text-2xl font-semibold text-center mb-8">{block.heading}</h2>}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
        {block.logos?.map((logo, i) => {
          const img = typeof logo.image === 'object' ? logo.image : null
          return img?.url ? <img key={i} src={img.url} alt={logo.name ?? img.alt ?? ''} className="h-12 mx-auto opacity-70 hover:opacity-100" /> : null
        })}
      </div>
    </section>
  )
}
```

- [ ] **`Component.client.tsx`** (only loaded if swiper enabled):

```tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'logo-cloud' }>

export function LogoCloudCarousel({ block }: { block: Block }) {
  return (
    <section className="px-6 py-12">
      {block.heading && <h2 className="text-2xl font-semibold text-center mb-8">{block.heading}</h2>}
      <div className="max-w-6xl mx-auto">
        <Swiper modules={[Autoplay]} slidesPerView={5} spaceBetween={32} loop autoplay={{ delay: 0, disableOnInteraction: false }} speed={6000}>
          {block.logos?.map((logo, i) => {
            const img = typeof logo.image === 'object' ? logo.image : null
            return img?.url ? (
              <SwiperSlide key={i}>
                <img src={img.url} alt={logo.name ?? img.alt ?? ''} className="h-12 mx-auto opacity-70" />
              </SwiperSlide>
            ) : null
          })}
        </Swiper>
      </div>
    </section>
  )
}
```

- [ ] **Add swiper dep (only if `features.swiper: true`)**:

```bash
pnpm add swiper
```

- [ ] **Commit:** `git add src/blocks/LogoCloud package.json pnpm-lock.yaml && git commit -m "feat(blocks): add LogoCloud (swiper-conditional)"`

---

### Task 34: Testimonials (only when `features.swiper: true`)

**Files:** `src/blocks/Testimonials/{config.ts,Component.tsx,Component.client.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  imageURL: '/blocks/testimonials.png',
  imageAltText: 'Testimonial slider',
  admin: { group: 'Social Proof' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`** (server):

```tsx
import { TestimonialsClient } from './Component.client'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'testimonials' }>

export function TestimonialsBlock({ block }: { block: Block }) {
  return <TestimonialsClient block={block} />
}
```

- [ ] **`Component.client.tsx`:**

```tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'testimonials' }>

export function TestimonialsClient({ block }: { block: Block }) {
  return (
    <section className="px-6 py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-8">{block.heading}</h2>}
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} loop>
          {block.items?.map((t, i) => {
            const avatar = typeof t.avatar === 'object' ? t.avatar : null
            return (
              <SwiperSlide key={i}>
                <blockquote className="text-center px-12 pb-8">
                  <p className="text-xl italic mb-6">"{t.quote}"</p>
                  {avatar?.url && <img src={avatar.url} alt={t.author} className="w-16 h-16 rounded-full mx-auto mb-3" />}
                  <cite className="not-italic font-semibold">{t.author}</cite>
                  {t.role && <div className="text-sm text-gray-600">{t.role}</div>}
                </blockquote>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/Testimonials && git commit -m "feat(blocks): add Testimonials (swiper-required)"`

---

### Task 35: FAQ (accordion)

**Files:** `src/blocks/FAQ/{config.ts,Component.tsx,Component.client.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const FAQ: Block = {
  slug: 'faq',
  imageURL: '/blocks/faq.png',
  imageAltText: 'FAQ accordion',
  admin: { group: 'Social Proof' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', editor: defaultLexical, required: true },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import { FAQClient } from './Component.client'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'faq' }>

export function FAQBlock({ block }: { block: Block }) {
  return <FAQClient block={block} />
}
```

- [ ] **`Component.client.tsx`:**

```tsx
'use client'
import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'faq' }>

export function FAQClient({ block }: { block: Block }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-8">{block.heading}</h2>}
        <div className="divide-y border-y">
          {block.items?.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i}>
                <button
                  className="w-full text-left py-4 font-medium flex justify-between items-center"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="text-2xl">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="pb-4 prose prose-sm">
                    <RichText data={item.answer} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/FAQ && git commit -m "feat(blocks): add FAQ accordion"`

---

### Task 36: Stats (counter cards; GSAP optional)

**Files:** `src/blocks/Stats/{config.ts,Component.tsx,Component.client.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  imageURL: '/blocks/stats.png',
  imageAltText: 'Animated stats / metrics',
  admin: { group: 'Data & Stats' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'Numeric or formatted ("$2.4M", "+47%", "12,500")' } },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'animateCounter', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`** (server, picks animation strategy from config):

```tsx
import starterConfig from '../../../starter.config'
import { StatsClient } from './Component.client'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'stats' }>

export function StatsBlock({ block }: { block: Block }) {
  return <StatsClient block={block} useGsap={starterConfig.features.gsap} />
}
```

- [ ] **`Component.client.tsx`:**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'stats' }>

function parseNumeric(s: string): { num: number; prefix: string; suffix: string } | null {
  const match = s.match(/^([^\d.-]*)([\d,.-]+)([^\d.]*)$/)
  if (!match) return null
  const num = parseFloat(match[2].replace(/,/g, ''))
  if (isNaN(num)) return null
  return { num, prefix: match[1] ?? '', suffix: match[3] ?? '' }
}

function CounterValue({ value, animate }: { value: string; animate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const parsed = parseNumeric(value)

  useEffect(() => {
    if (!animate || !parsed) { setDisplay(value); return }
    let raf = 0
    const start = performance.now()
    const duration = 1500
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = parsed.num * eased
      setDisplay(parsed.prefix + Math.round(current).toLocaleString() + parsed.suffix)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, animate, parsed])

  return <span ref={ref}>{display}</span>
}

export function StatsClient({ block, useGsap: _useGsap }: { block: Block; useGsap: boolean }) {
  // GSAP currently uses the same RAF path; if true, the user can later swap in scroll-triggered timeline.
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold text-center mb-10">{block.heading}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {block.items?.map((item, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CounterValue value={item.value} animate={item.animateCounter ?? true} />
              </div>
              <div className="font-medium">{item.label}</div>
              {item.description && <div className="text-sm text-gray-600 mt-1">{item.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/Stats && git commit -m "feat(blocks): add Stats with counter animation (GSAP optional)"`

---

### Task 37: StatsChart (Recharts; only when `features.charts: true`)

**Files:** `src/blocks/StatsChart/{config.ts,Component.tsx,Component.client.tsx}`

- [ ] **`config.ts`:**

```ts
import type { Block } from 'payload'

export const StatsChart: Block = {
  slug: 'stats-chart',
  imageURL: '/blocks/stats-chart.png',
  imageAltText: 'Chart with statistical callouts',
  admin: { group: 'Data & Stats' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'stats-and-chart',
      options: [
        { label: 'Stats + Chart', value: 'stats-and-chart' },
        { label: 'Chart only', value: 'chart-only' },
        { label: 'Stats only', value: 'stats-only' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'animateCounter', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'chart',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'line',
          options: [
            { label: 'Line', value: 'line' }, { label: 'Bar', value: 'bar' },
            { label: 'Area', value: 'area' }, { label: 'Donut', value: 'donut' },
          ],
        },
        { name: 'xAxisLabel', type: 'text' },
        { name: 'yAxisLabel', type: 'text' },
        {
          name: 'series',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'color', type: 'text', admin: { description: 'Hex color, e.g. #3b82f6' } },
            {
              name: 'dataPoints',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **`Component.tsx`:**

```tsx
import { StatsChartClient } from './Component.client'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'stats-chart' }>

export function StatsChartBlock({ block }: { block: Block }) {
  return <StatsChartClient block={block} />
}
```

- [ ] **`Component.client.tsx`:**

```tsx
'use client'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'stats-chart' }>

function buildChartData(block: Block) {
  const series = block.chart?.series ?? []
  if (series.length === 0) return []
  const labels = series[0].dataPoints?.map((p) => p.label) ?? []
  return labels.map((label, i) => {
    const row: Record<string, string | number> = { label: label ?? '' }
    series.forEach((s) => { row[s.name ?? ''] = s.dataPoints?.[i]?.value ?? 0 })
    return row
  })
}

function ChartView({ block }: { block: Block }) {
  const data = buildChartData(block)
  const series = block.chart?.series ?? []
  const colors = series.map((s, i) => s.color ?? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4])

  if (block.chart?.type === 'donut') {
    const flat = series.flatMap((s) => (s.dataPoints ?? []).map((p) => ({ name: p.label, value: p.value ?? 0 })))
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={flat} dataKey="value" innerRadius={60} outerRadius={100} label>
            {flat.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const Chart = block.chart?.type === 'bar' ? BarChart
    : block.chart?.type === 'area' ? AreaChart
    : LineChart

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" label={{ value: block.chart?.xAxisLabel ?? '', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: block.chart?.yAxisLabel ?? '', angle: -90, position: 'insideLeft' }} />
        <Tooltip /><Legend />
        {series.map((s, i) => {
          const color = colors[i]
          if (block.chart?.type === 'bar') return <Bar key={s.name ?? i} dataKey={s.name ?? ''} fill={color} />
          if (block.chart?.type === 'area') return <Area key={s.name ?? i} dataKey={s.name ?? ''} stroke={color} fill={color} />
          return <Line key={s.name ?? i} dataKey={s.name ?? ''} stroke={color} strokeWidth={2} />
        })}
      </Chart>
    </ResponsiveContainer>
  )
}

export function StatsChartClient({ block }: { block: Block }) {
  const layout = block.layout ?? 'stats-and-chart'
  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.title && <h2 className="text-3xl font-bold mb-2">{block.title}</h2>}
        {block.description && <p className="text-gray-600 mb-8">{block.description}</p>}
        <div className={`grid gap-8 ${layout === 'stats-and-chart' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {layout !== 'chart-only' && block.stats && block.stats.length > 0 && (
            <div className="space-y-6">
              {block.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-blue-600">{s.value}</div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {layout !== 'stats-only' && <div><ChartView block={block} /></div>}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit:** `git add src/blocks/StatsChart && git commit -m "feat(blocks): add StatsChart (Recharts, charts toggle)"`

---

### Task 38: Register all blocks in Pages + RenderBlocks

**Files:**
- Modify: `src/blocks/RenderBlocks.tsx`
- Modify: `src/collections/Pages/index.ts`

- [ ] **Step 1: Update `src/blocks/RenderBlocks.tsx`** with full mapping (respecting toggles):

```tsx
import starterConfig from '../../starter.config'
import type { Page } from '@/payload-types'
import { HeroBlock } from './Hero/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { RichTextBlockComponent } from './RichTextBlock/Component'
import { MediaWithTextBlock } from './MediaWithText/Component'
import { ContentMediaBlock } from './ContentMedia/Component'
import { TextColumnsBlock } from './TextColumns/Component'
import { FeatureGridBlock } from './FeatureGrid/Component'
import { ImageGridBlock } from './ImageGrid/Component'
import { LogoCloudBlock } from './LogoCloud/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { FAQBlock } from './FAQ/Component'
import { StatsBlock } from './Stats/Component'
import { StatsChartBlock } from './StatsChart/Component'

type Block = NonNullable<Page['blocks']>[number]

const baseComponents: Record<string, React.ComponentType<{ block: any }>> = {
  hero: HeroBlock,
  'call-to-action': CallToActionBlock,
  'rich-text-block': RichTextBlockComponent,
  'media-with-text': MediaWithTextBlock,
  'content-media': ContentMediaBlock,
  'text-columns': TextColumnsBlock,
  'feature-grid': FeatureGridBlock,
  'image-grid': ImageGridBlock,
  'logo-cloud': LogoCloudBlock,
  faq: FAQBlock,
  stats: StatsBlock,
}

const components: Record<string, React.ComponentType<{ block: any }>> = {
  ...baseComponents,
  ...(starterConfig.features.swiper ? { testimonials: TestimonialsBlock } : {}),
  ...(starterConfig.features.charts ? { 'stats-chart': StatsChartBlock } : {}),
}

export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = components[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return <Component key={i} block={block} />
      })}
    </>
  )
}
```

- [ ] **Step 2: Update Pages collection's `blocks` field** in `src/collections/Pages/index.ts`. Replace the `blocks: [Hero]` line with toggleable list:

```ts
import starterConfig from '../../../starter.config'
// ... existing imports ...
import { Hero } from '@/blocks/Hero/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { RichTextBlock } from '@/blocks/RichTextBlock/config'
import { MediaWithText } from '@/blocks/MediaWithText/config'
import { ContentMedia } from '@/blocks/ContentMedia/config'
import { TextColumns } from '@/blocks/TextColumns/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { ImageGrid } from '@/blocks/ImageGrid/config'
import { LogoCloud } from '@/blocks/LogoCloud/config'
import { Testimonials } from '@/blocks/Testimonials/config'
import { FAQ } from '@/blocks/FAQ/config'
import { Stats } from '@/blocks/Stats/config'
import { StatsChart } from '@/blocks/StatsChart/config'

const allBlocks = [
  Hero, CallToAction, RichTextBlock, MediaWithText, ContentMedia, TextColumns,
  FeatureGrid, ImageGrid, LogoCloud, FAQ, Stats,
  ...(starterConfig.features.swiper ? [Testimonials] : []),
  ...(starterConfig.features.charts ? [StatsChart] : []),
]

// Inside fields → tabs → Content → blocks field:
{
  name: 'blocks',
  type: 'blocks',
  minRows: 0,
  blocks: allBlocks,
},
```

- [ ] **Step 3: Regenerate types + create migration**

```bash
pnpm generate:types
pnpm migrate:create --name=pages-all-blocks
pnpm migrate
```

- [ ] **Step 4: Manual smoke test in admin**

```bash
pnpm dev
```

In `/admin/collections/pages/[home-page-id]`, the block-picker shows 13 (or 11 with default toggles) blocks grouped under headings "Hero & CTA", "Content", "Lists & Grids", "Social Proof", "Data & Stats". Add one of each, save, view on frontend.

- [ ] **Step 5: Commit**

```bash
git add src/blocks/RenderBlocks.tsx src/collections/Pages/index.ts src/payload-types.ts src/migrations
git commit -m "feat(blocks): register all 13 blocks in Pages with toggle-based filtering"
```

**Phase 6 Checkpoint:** All 13 blocks selectable in admin, render on frontend. Toggle `features.swiper` or `features.charts` to false, restart, confirm those blocks disappear from the picker AND existing blocks of those types stop rendering.

---

## Phase 7 — Content Collections

### Task 39: Categories + Tags

**Files:**
- Modify: `src/collections/Categories.ts`
- Modify: `src/collections/Tags.ts`

- [ ] **Step 1: `src/collections/Categories.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'] },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    slugField('title'),
  ],
}
```

- [ ] **Step 2: `src/collections/Tags.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'] },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
  ],
}
```

- [ ] **Step 3: Commit**

```bash
git add src/collections/Categories.ts src/collections/Tags.ts
git commit -m "feat(collections): add Categories and Tags"
```

---

### Task 40: Blog collection

**Files:**
- Modify: `src/collections/Blog/index.ts`
- Create: `src/collections/Blog/access.ts`

- [ ] **Step 1: `src/collections/Blog/access.ts`**

```ts
import type { Access } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const blogReadAccess: Access = ({ req }) => {
  const role = (req.user as { role?: string })?.role
  if (role === 'admin' || role === 'editor') return true
  return { _status: { equals: 'published' } }
}

export const blogWriteAccess = isAdminOrEditor
```

- [ ] **Step 2: Replace `src/collections/Blog/index.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { blogReadAccess, blogWriteAccess } from './access'
import starterConfig from '../../../starter.config'

const enableCategories = starterConfig.collections.categories
const enableTags = starterConfig.collections.tags

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
  },
  access: {
    read: blogReadAccess,
    create: blogWriteAccess,
    update: blogWriteAccess,
    delete: blogWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
          ],
        },
        {
          label: 'Meta',
          fields: [
            { name: 'author', type: 'relationship', relationTo: 'users' },
            ...(enableCategories ? [{
              name: 'categories', type: 'relationship' as const,
              relationTo: 'categories' as const, hasMany: true,
            }] : []),
            ...(enableTags ? [{
              name: 'tags', type: 'relationship' as const,
              relationTo: 'tags' as const, hasMany: true,
            }] : []),
            { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
```

- [ ] **Step 3: Commit**

```bash
git add src/collections/Blog/
git commit -m "feat(collections): add full Blog with drafts and conditional taxonomy fields"
```

---

### Task 41: CaseStudies collection

**Files:**
- Modify: `src/collections/CaseStudies/index.ts`
- Create: `src/collections/CaseStudies/access.ts`

- [ ] **Step 1: `src/collections/CaseStudies/access.ts`**

```ts
import type { Access } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const caseStudiesReadAccess: Access = ({ req }) => {
  const role = (req.user as { role?: string })?.role
  if (role === 'admin' || role === 'editor') return true
  return { _status: { equals: 'published' } }
}

export const caseStudiesWriteAccess = isAdminOrEditor
```

- [ ] **Step 2: Replace `src/collections/CaseStudies/index.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { caseStudiesReadAccess, caseStudiesWriteAccess } from './access'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'publishedAt', '_status'],
  },
  access: {
    read: caseStudiesReadAccess,
    create: caseStudiesWriteAccess,
    update: caseStudiesWriteAccess,
    delete: caseStudiesWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
          ],
        },
        {
          label: 'Meta',
          fields: [
            { name: 'client', type: 'text' },
            { name: 'industry', type: 'text' },
            {
              name: 'services',
              type: 'array',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            { name: 'duration', type: 'text', admin: { description: 'e.g. "3 months", "Q1 2024"' } },
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              relationTo: 'case-studies',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
            },
            { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
```

- [ ] **Step 3: Regenerate types and migrate**

```bash
pnpm generate:types
pnpm migrate:create --name=blog-case-studies-categories-tags
pnpm migrate
```

- [ ] **Step 4: Commit**

```bash
git add src/collections/CaseStudies/ src/payload-types.ts src/migrations
git commit -m "feat(collections): add CaseStudies; migrate"
```

**Phase 7 Checkpoint:** Admin shows Blog, CaseStudies, Categories, Tags collections (depending on toggles). Create one of each, verify drafts, slug auto-gen.

---

## Phase 8 — Frontend Routes, Header/Footer Globals, i18n Infrastructure

### Task 42: Header + Footer globals

**Files:**
- Create: `src/globals/Header.ts`
- Create: `src/globals/Footer.ts`
- Modify: `src/payload.config.ts` to register globals

- [ ] **Step 1: `src/globals/Header.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'items',
      type: 'array',
      maxRows: 10,
      fields: [linkField()],
    },
  ],
}
```

- [ ] **Step 2: `src/globals/Footer.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text' },
        { name: 'items', type: 'array', fields: [linkField()] },
      ],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'copyright', type: 'text' },
  ],
}
```

- [ ] **Step 3: Register in `src/payload.config.ts`**

Replace `globals: [],` with:
```ts
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
// ...
globals: [Header, Footer],
```

- [ ] **Step 4: Migrate**

```bash
pnpm generate:types
pnpm migrate:create --name=header-footer-globals
pnpm migrate
```

- [ ] **Step 5: Commit**

```bash
git add src/globals/Header.ts src/globals/Footer.ts src/payload.config.ts src/payload-types.ts src/migrations
git commit -m "feat(globals): add Header and Footer globals"
```

---

### Task 43: i18n config + Translations global (gated by locale count)

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/locales/en.json`
- Create: `src/globals/Translations.ts`
- Create: `src/utilities/getTranslations.ts`
- Modify: `src/payload.config.ts` to conditionally add Translations global

- [ ] **Step 1: `src/i18n/config.ts`**

```ts
import starterConfig from '../../starter.config'

export type Locale = string

export const locales = starterConfig.i18n.locales
export const defaultLocale = starterConfig.i18n.defaultLocale
export const isMultiLocale = locales.length > 1
```

- [ ] **Step 2: `src/i18n/locales/en.json`**

```json
{
  "navigation": { "home": "Home", "about": "About", "contact": "Contact", "blog": "Blog", "caseStudies": "Case Studies" },
  "buttons": { "readMore": "Read more", "submit": "Submit", "learnMore": "Learn more" },
  "common": { "loading": "Loading...", "error": "Something went wrong" }
}
```

- [ ] **Step 3: `src/globals/Translations.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Translations: GlobalConfig = {
  slug: 'translations',
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        { name: 'home', type: 'text', localized: true },
        { name: 'about', type: 'text', localized: true },
        { name: 'contact', type: 'text', localized: true },
        { name: 'blog', type: 'text', localized: true },
        { name: 'caseStudies', type: 'text', localized: true },
      ],
    },
    {
      name: 'buttons',
      type: 'group',
      fields: [
        { name: 'readMore', type: 'text', localized: true },
        { name: 'submit', type: 'text', localized: true },
        { name: 'learnMore', type: 'text', localized: true },
      ],
    },
  ],
}
```

- [ ] **Step 4: `src/utilities/getTranslations.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import enFallback from '@/i18n/locales/en.json'
import { isMultiLocale } from '@/i18n/config'

type Translations = typeof enFallback

async function fetchTranslations(locale: string): Promise<Translations> {
  if (!isMultiLocale) return enFallback as Translations
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'translations', locale })
    return { ...enFallback, ...(data as Partial<Translations>) }
  } catch {
    return enFallback as Translations
  }
}

export const getTranslations = (locale: string) =>
  unstable_cache(
    () => fetchTranslations(locale),
    ['translations', locale],
    { tags: [`translations:${locale}`], revalidate: 300 },
  )()
```

- [ ] **Step 5: Conditionally register Translations in `src/payload.config.ts`**

Replace:
```ts
globals: [Header, Footer],
```
with:
```ts
import { Translations } from './globals/Translations'
// ...
globals: starterConfig.i18n.locales.length > 1
  ? [Header, Footer, Translations]
  : [Header, Footer],
```

- [ ] **Step 6: Migrate (no schema change unless multi-locale active; safe to run)**

```bash
pnpm generate:types
pnpm migrate:create --name=translations-conditional
pnpm migrate
```

- [ ] **Step 7: Commit**

```bash
git add src/i18n src/globals/Translations.ts src/utilities/getTranslations.ts src/payload.config.ts src/payload-types.ts src/migrations
git commit -m "feat(i18n): add config, fallback locale JSON, conditional Translations global"
```

---

### Task 44: Header/Footer React components + Language Switcher + frontend layout

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/LanguageSwitcher.tsx`
- Modify: `src/app/(frontend)/layout.tsx`

- [ ] **Step 1: `src/components/Header.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import { isMultiLocale } from '@/i18n/config'

export async function Header() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'header' })
  const logo = typeof data.logo === 'object' ? data.logo : null

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold">
          {logo?.url ? <img src={logo.url} alt="Logo" className="h-8" /> : 'Payload Starter'}
        </Link>
        <nav className="flex gap-6 items-center">
          {(data.items ?? []).map((item, i) => {
            const link = item.link
            const href = link?.type === 'reference' && typeof link.reference?.value === 'object'
              ? `/${link.reference.value.slug ?? ''}` : link?.url ?? '#'
            return (
              <Link key={i} href={href} target={link?.newTab ? '_blank' : undefined}>
                {link?.label ?? ''}
              </Link>
            )
          })}
          {isMultiLocale && <LanguageSwitcher />}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: `src/components/Footer.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export async function Footer() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'footer' })

  return (
    <footer className="border-t mt-16 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {(data.columns ?? []).map((col, i) => (
          <div key={i}>
            {col.title && <h4 className="font-semibold mb-3">{col.title}</h4>}
            <ul className="space-y-2 text-sm">
              {(col.items ?? []).map((it, j) => {
                const link = it.link
                const href = link?.type === 'reference' && typeof link.reference?.value === 'object'
                  ? `/${link.reference.value.slug ?? ''}` : link?.url ?? '#'
                return <li key={j}><Link href={href}>{link?.label ?? ''}</Link></li>
              })}
            </ul>
          </div>
        ))}
      </div>
      {data.copyright && (
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t text-sm text-gray-500 text-center">
          {data.copyright}
        </div>
      )}
    </footer>
  )
}
```

- [ ] **Step 3: `src/components/LanguageSwitcher.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { locales, defaultLocale } from '@/i18n/config'

export function LanguageSwitcher() {
  const [current, setCurrent] = useState(defaultLocale)

  useEffect(() => {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('NEXT_LOCALE='))
    if (cookie) setCurrent(cookie.split('=')[1])
  }, [])

  const change = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <select
      value={current}
      onChange={(e) => change(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {locales.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
    </select>
  )
}
```

- [ ] **Step 4: Replace `src/app/(frontend)/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Payload Starter', template: '%s | Payload Starter' },
  description: 'Payload + Next.js starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components src/app/\(frontend\)/layout.tsx
git commit -m "feat(frontend): add Header, Footer components and LanguageSwitcher"
```

---

### Task 45: Blog frontend routes

**Files:**
- Create: `src/app/(frontend)/blog/page.tsx`
- Create: `src/app/(frontend)/blog/[slug]/page.tsx`
- Create: `src/app/(frontend)/blog/category/[slug]/page.tsx`
- Create: `src/app/(frontend)/blog/tag/[slug]/page.tsx`
- Create: `src/utilities/getBlogPosts.ts`

- [ ] **Step 1: `src/utilities/getBlogPosts.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Blog } from '@/payload-types'

interface FindArgs {
  page?: number
  limit?: number
  categorySlug?: string
  tagSlug?: string
}

export async function findBlogPosts({ page = 1, limit = 10, categorySlug, tagSlug }: FindArgs = {}) {
  const payload = await getPayload({ config })
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
  if (categorySlug) where['categories.slug'] = { equals: categorySlug }
  if (tagSlug) where['tags.slug'] = { equals: tagSlug }
  const result = await payload.find({
    collection: 'blog',
    where,
    page,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return result
}

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as Blog) ?? null
}
```

- [ ] **Step 2: `src/app/(frontend)/blog/page.tsx`**

```tsx
import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'

export default async function BlogList() {
  const { docs } = await findBlogPosts({ limit: 20 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}

export const metadata = { title: 'Blog' }
```

- [ ] **Step 3: `src/app/(frontend)/blog/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getBlogPostBySlug } from '@/utilities/getBlogPosts'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || post._status !== 'published') notFound()
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.publishedAt && (
        <p className="text-sm text-gray-500 mb-8">{new Date(post.publishedAt).toLocaleDateString()}</p>
      )}
      <article className="prose"><RichText data={post.content} /></article>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {}
}
```

- [ ] **Step 4: `src/app/(frontend)/blog/category/[slug]/page.tsx`**

```tsx
import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogByCategory({ params }: Props) {
  const { slug } = await params
  const { docs } = await findBlogPosts({ categorySlug: slug, limit: 50 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Category: {slug}</h1>
      <div className="space-y-6">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            {post.excerpt && <p className="text-gray-600 mt-1">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 5: `src/app/(frontend)/blog/tag/[slug]/page.tsx`** (same shape as category)

```tsx
import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogByTag({ params }: Props) {
  const { slug } = await params
  const { docs } = await findBlogPosts({ tagSlug: slug, limit: 50 })
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Tag: {slug}</h1>
      <div className="space-y-6">
        {docs.map((post) => (
          <article key={post.id}>
            <h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            {post.excerpt && <p className="text-gray-600 mt-1">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/\(frontend\)/blog src/utilities/getBlogPosts.ts
git commit -m "feat(frontend): add blog list, single, category, tag routes"
```

---

### Task 46: CaseStudies frontend routes

**Files:**
- Create: `src/app/(frontend)/case-studies/page.tsx`
- Create: `src/app/(frontend)/case-studies/[slug]/page.tsx`
- Create: `src/utilities/getCaseStudies.ts`

- [ ] **Step 1: `src/utilities/getCaseStudies.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CaseStudy } from '@/payload-types'

export async function findCaseStudies({ industry, service }: { industry?: string; service?: string } = {}) {
  const payload = await getPayload({ config })
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
  if (industry) where.industry = { equals: industry }
  if (service) where['services.name'] = { equals: service }
  return payload.find({
    collection: 'case-studies',
    where,
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
  })
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as CaseStudy) ?? null
}
```

- [ ] **Step 2: `src/app/(frontend)/case-studies/page.tsx`**

```tsx
import Link from 'next/link'
import { findCaseStudies } from '@/utilities/getCaseStudies'

export default async function CaseStudiesList() {
  const { docs } = await findCaseStudies()
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {docs.map((cs) => (
          <article key={cs.id} className="border rounded-lg overflow-hidden">
            {typeof cs.coverImage === 'object' && cs.coverImage?.url && (
              <img src={cs.coverImage.url} alt="" className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/case-studies/${cs.slug}`}>{cs.title}</Link>
              </h2>
              <p className="text-sm text-gray-500">{cs.client} {cs.industry && `· ${cs.industry}`}</p>
              {cs.excerpt && <p className="mt-2 text-gray-600">{cs.excerpt}</p>}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export const metadata = { title: 'Case Studies' }
```

- [ ] **Step 3: `src/app/(frontend)/case-studies/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCaseStudyBySlug } from '@/utilities/getCaseStudies'

type Props = { params: Promise<{ slug: string }> }

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs || cs._status !== 'published') notFound()
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">{cs.title}</h1>
      <p className="text-gray-500 mb-8">
        {cs.client} {cs.industry && `· ${cs.industry}`} {cs.duration && `· ${cs.duration}`}
      </p>
      {cs.services && cs.services.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {cs.services.map((s, i) => (
            <span key={i} className="px-3 py-1 text-sm bg-gray-100 rounded-full">{s.name}</span>
          ))}
        </div>
      )}
      <article className="prose"><RichText data={cs.content} /></article>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  return cs ? { title: cs.title, description: cs.excerpt ?? undefined } : {}
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(frontend\)/case-studies src/utilities/getCaseStudies.ts
git commit -m "feat(frontend): add case-studies list and single routes"
```

**Phase 8 Checkpoint:** `/blog`, `/blog/<slug>`, `/blog/category/<slug>`, `/blog/tag/<slug>`, `/case-studies`, `/case-studies/<slug>` all render. Header and Footer pull from globals. Language switcher appears only when multi-locale active.

---

## Phase 9 — Plugin Verification + ContactForm Block

The plugins (`seo`, `redirects`, `search`, `formBuilder`, `nestedDocs`, `importExport`) are already wired through `buildPlugins()` in Task 11. This phase exposes their UI and the contact-form rendering block.

### Task 47: Verify SEO + Redirects + Search plugins active

- [ ] **Step 1: Boot admin and confirm**

```bash
pnpm dev
```

In `/admin`:
- Pages collection has an "SEO" tab with title/description/image fields.
- Redirects collection appears in sidebar (under "Plugins" group).
- Search collection appears (auto-indexed entries from Pages, Blog, CaseStudies).

Stop with Ctrl+C.

- [ ] **Step 2: Add SEO meta to frontend pages**

Modify `src/app/(frontend)/[slug]/page.tsx` `generateMetadata`:

```ts
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  const meta = (page as { meta?: { title?: string; description?: string; image?: { url?: string } } }).meta
  return {
    title: meta?.title ?? page.title,
    description: meta?.description ?? undefined,
    openGraph: {
      title: meta?.title ?? page.title,
      description: meta?.description ?? undefined,
      images: meta?.image?.url ? [{ url: meta.image.url }] : undefined,
    },
  }
}
```

Apply same pattern to `blog/[slug]/page.tsx` and `case-studies/[slug]/page.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)
git commit -m "feat(seo): use plugin-seo meta in route generateMetadata"
```

---

### Task 48: ContactFormBlock (when `features.formBuilder: true`)

**Files:**
- Create: `src/blocks/ContactForm/config.ts`
- Create: `src/blocks/ContactForm/Component.tsx`
- Create: `src/blocks/ContactForm/Component.client.tsx`
- Modify: `src/blocks/RenderBlocks.tsx`
- Modify: `src/collections/Pages/index.ts`

- [ ] **Step 1: `src/blocks/ContactForm/config.ts`**

```ts
import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contact-form-block',
  imageURL: '/blocks/contact-form.png',
  imageAltText: 'Contact form (uses plugin-form-builder)',
  admin: { group: 'Forms' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
```

- [ ] **Step 2: `src/blocks/ContactForm/Component.tsx`**

```tsx
import { ContactFormClient } from './Component.client'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'contact-form-block' }>

export function ContactFormBlockComponent({ block }: { block: Block }) {
  if (typeof block.form !== 'object' || !block.form) return null
  return <ContactFormClient block={block} />
}
```

- [ ] **Step 3: `src/blocks/ContactForm/Component.client.tsx`**

```tsx
'use client'
import { useState } from 'react'
import type { Page, Form } from '@/payload-types'

type Block = Extract<NonNullable<Page['blocks']>[number], { blockType: 'contact-form-block' }>

export function ContactFormClient({ block }: { block: Block }) {
  const form = block.form as Form
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const submissionData = Array.from(formData.entries()).map(([field, value]) => ({ field, value: String(value) }))
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: form.id, submissionData }),
    })
    setSubmitting(false)
    if (res.ok) setDone(true)
  }

  if (done && form.confirmationMessage) {
    return <div className="prose mx-auto px-6 py-12 max-w-2xl">Thanks — we'll be in touch.</div>
  }

  return (
    <section className="px-6 py-12">
      <div className="max-w-xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold mb-2">{block.heading}</h2>}
        {block.description && <p className="text-gray-600 mb-6">{block.description}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          {(form.fields ?? []).map((field, i) => {
            const f = field as { blockType: string; name: string; label?: string; required?: boolean; defaultValue?: string }
            if (f.blockType === 'text' || f.blockType === 'email') {
              return (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{f.label ?? f.name}</label>
                  <input
                    type={f.blockType === 'email' ? 'email' : 'text'}
                    name={f.name}
                    required={f.required}
                    defaultValue={f.defaultValue ?? ''}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )
            }
            if (f.blockType === 'textarea') {
              return (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{f.label ?? f.name}</label>
                  <textarea name={f.name} required={f.required} className="w-full border rounded px-3 py-2 min-h-[120px]" />
                </div>
              )
            }
            return null
          })}
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Sending...' : (form.submitButtonLabel ?? 'Submit')}
          </button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Register in RenderBlocks** — add to the `components` map (only if `features.formBuilder`):

In `src/blocks/RenderBlocks.tsx`:
```ts
import { ContactFormBlockComponent } from './ContactForm/Component'
// ...
const components: Record<string, React.ComponentType<{ block: any }>> = {
  ...baseComponents,
  ...(starterConfig.features.swiper ? { testimonials: TestimonialsBlock } : {}),
  ...(starterConfig.features.charts ? { 'stats-chart': StatsChartBlock } : {}),
  ...(starterConfig.features.formBuilder ? { 'contact-form-block': ContactFormBlockComponent } : {}),
}
```

- [ ] **Step 5: Register in Pages.blocks** in `src/collections/Pages/index.ts`:
```ts
import { ContactFormBlock } from '@/blocks/ContactForm/config'
// ...
const allBlocks = [
  Hero, CallToAction, RichTextBlock, MediaWithText, ContentMedia, TextColumns,
  FeatureGrid, ImageGrid, LogoCloud, FAQ, Stats,
  ...(starterConfig.features.swiper ? [Testimonials] : []),
  ...(starterConfig.features.charts ? [StatsChart] : []),
  ...(starterConfig.features.formBuilder ? [ContactFormBlock] : []),
]
```

- [ ] **Step 6: Add a `contact-form.png` placeholder PNG**

```bash
node -e "import('sharp').then(async (s) => { const sharp = s.default; const svg = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"120\"><rect width=\"100%\" height=\"100%\" fill=\"#f5f5f5\" stroke=\"#ccc\"/><text x=\"50%\" y=\"50%\" font-family=\"sans-serif\" font-size=\"14\" fill=\"#444\" text-anchor=\"middle\" dominant-baseline=\"middle\">contact-form</text></svg>'; await sharp(Buffer.from(svg)).png().toFile('public/blocks/contact-form.png') })"
```

- [ ] **Step 7: Migrate + commit**

```bash
pnpm generate:types
pnpm migrate:create --name=contact-form-block
pnpm migrate
git add src/blocks/ContactForm src/blocks/RenderBlocks.tsx src/collections/Pages public/blocks/contact-form.png src/payload-types.ts src/migrations
git commit -m "feat(blocks): add ContactFormBlock (form-builder integration)"
```

**Phase 9 Checkpoint:** All toggleable plugins surface their admin UI; ContactFormBlock renders a form when the user picks one in admin.

---

## Phase 10 — i18n Codemod + `pnpm starter:sync`

### Task 49: i18n codemod (TDD)

**Files:**
- Create: `scripts/codemods/i18n.ts`
- Create: `scripts/codemods/i18n.test.ts`

The codemod uses `ts-morph` to parse a `CollectionConfig` source file, walk its `fields` array, and add or remove `localized: true` properties on individual field object literals based on the rules in spec §8.

- [ ] **Step 1: Write failing tests `scripts/codemods/i18n.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { applyI18nCodemod } from './i18n'

function run(source: string, opts: Parameters<typeof applyI18nCodemod>[2]) {
  const project = new Project({ useInMemoryFileSystem: true })
  const file = project.createSourceFile('test.ts', source)
  applyI18nCodemod(file, 'pages', opts)
  return file.getFullText()
}

const baseSource = `
import type { CollectionConfig } from 'payload'
export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'email', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'tagsJoin', type: 'text', unique: true },
  ],
}
`

describe('applyI18nCodemod', () => {
  it('adds localized: true to text/richText fields not in denylist', () => {
    const result = run(baseSource, { mode: 'add', skipFields: [], forceFields: [], skipCollections: [] })
    expect(result).toContain("name: 'title', type: 'text', localized: true")
    expect(result).toContain("name: 'content', type: 'richText', localized: true")
  })

  it('skips fields whose name is in denylist (slug, email)', () => {
    const result = run(baseSource, { mode: 'add', skipFields: [], forceFields: [], skipCollections: [] })
    expect(result).not.toMatch(/name: 'slug',[^}]*localized: true/)
    expect(result).not.toMatch(/name: 'email',[^}]*localized: true/)
  })

  it('skips fields with unique: true', () => {
    const result = run(baseSource, { mode: 'add', skipFields: [], forceFields: [], skipCollections: [] })
    expect(result).not.toMatch(/name: 'tagsJoin',[^}]*localized: true/)
  })

  it('respects skipFields override (pages.title)', () => {
    const result = run(baseSource, { mode: 'add', skipFields: ['pages.title'], forceFields: [], skipCollections: [] })
    expect(result).not.toMatch(/name: 'title',[^}]*localized: true/)
  })

  it('respects forceFields override (pages.email)', () => {
    const result = run(baseSource, { mode: 'add', skipFields: [], forceFields: ['pages.email'], skipCollections: [] })
    expect(result).toContain("name: 'email', type: 'text', localized: true")
  })

  it('skips entire collection in skipCollections', () => {
    const result = run(baseSource, { mode: 'add', skipFields: [], forceFields: [], skipCollections: ['pages'] })
    expect(result).not.toContain('localized: true')
  })

  it('removes localized: true in remove mode', () => {
    const withLocal = baseSource.replace(`type: 'text', required: true`, `type: 'text', required: true, localized: true`)
    const result = run(withLocal, { mode: 'remove', skipFields: [], forceFields: [], skipCollections: [] })
    expect(result).not.toContain('localized: true')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit -- codemods/i18n
```

- [ ] **Step 3: Write `scripts/codemods/i18n.ts`**

```ts
import { type SourceFile, type ObjectLiteralExpression, Node, SyntaxKind } from 'ts-morph'

const DENYLIST = new Set([
  'slug', 'email', 'url', 'phone', '_status', 'role', 'password', 'id',
  'key', 'code', 'provider', 'iconName', 'staticURL',
])

const LOCALIZABLE_TYPES = new Set(['text', 'textarea', 'richText', 'select'])

export interface CodemodOptions {
  mode: 'add' | 'remove'
  skipFields: string[]
  forceFields: string[]
  skipCollections: string[]
}

function getStringProp(obj: ObjectLiteralExpression, name: string): string | undefined {
  const prop = obj.getProperty(name)
  if (!prop || !Node.isPropertyAssignment(prop)) return undefined
  const init = prop.getInitializer()
  if (!init || !Node.isStringLiteral(init)) return undefined
  return init.getLiteralValue()
}

function getBoolProp(obj: ObjectLiteralExpression, name: string): boolean {
  const prop = obj.getProperty(name)
  if (!prop || !Node.isPropertyAssignment(prop)) return false
  const init = prop.getInitializer()
  return init?.getKind() === SyntaxKind.TrueKeyword
}

function shouldLocalize(field: ObjectLiteralExpression, collectionSlug: string, opts: CodemodOptions): boolean {
  const name = getStringProp(field, 'name')
  const type = getStringProp(field, 'type')
  if (!name || !type) return false

  const fqName = `${collectionSlug}.${name}`
  if (opts.forceFields.includes(fqName)) return true
  if (opts.skipFields.includes(fqName)) return false
  if (DENYLIST.has(name)) return false
  if (getBoolProp(field, 'unique')) return false
  if (!LOCALIZABLE_TYPES.has(type)) return false
  return true
}

function walkFieldArray(arrayExpr: Node, collectionSlug: string, opts: CodemodOptions) {
  if (!Node.isArrayLiteralExpression(arrayExpr)) return

  for (const element of arrayExpr.getElements()) {
    if (!Node.isObjectLiteralExpression(element)) continue

    const type = getStringProp(element, 'type')

    // Recurse into array/group/blocks fields
    if (type === 'array' || type === 'group') {
      const nestedFieldsProp = element.getProperty('fields')
      if (nestedFieldsProp && Node.isPropertyAssignment(nestedFieldsProp)) {
        const init = nestedFieldsProp.getInitializer()
        if (init) walkFieldArray(init, collectionSlug, opts)
      }
      continue
    }

    if (type === 'tabs') {
      const tabsProp = element.getProperty('tabs')
      if (tabsProp && Node.isPropertyAssignment(tabsProp)) {
        const tabsArray = tabsProp.getInitializer()
        if (tabsArray && Node.isArrayLiteralExpression(tabsArray)) {
          for (const tab of tabsArray.getElements()) {
            if (Node.isObjectLiteralExpression(tab)) {
              const tabFields = tab.getProperty('fields')
              if (tabFields && Node.isPropertyAssignment(tabFields)) {
                const init = tabFields.getInitializer()
                if (init) walkFieldArray(init, collectionSlug, opts)
              }
            }
          }
        }
      }
      continue
    }

    const wantLocalized = shouldLocalize(element, collectionSlug, opts)
    const hasLocalized = element.getProperty('localized') !== undefined

    if (opts.mode === 'add' && wantLocalized && !hasLocalized) {
      element.addPropertyAssignment({ name: 'localized', initializer: 'true' })
    }
    if (opts.mode === 'remove' && hasLocalized) {
      const prop = element.getProperty('localized')
      if (prop) prop.remove()
    }
  }
}

export function applyI18nCodemod(file: SourceFile, collectionSlug: string, opts: CodemodOptions) {
  if (opts.skipCollections.includes(collectionSlug)) return

  // Find an exported `CollectionConfig` object literal in the file.
  const exports = file.getExportSymbols()
  for (const sym of exports) {
    const decl = sym.getDeclarations()[0]
    if (!decl) continue
    if (Node.isVariableDeclaration(decl)) {
      const init = decl.getInitializer()
      if (init && Node.isObjectLiteralExpression(init)) {
        const fieldsProp = init.getProperty('fields')
        if (fieldsProp && Node.isPropertyAssignment(fieldsProp)) {
          const arr = fieldsProp.getInitializer()
          if (arr) walkFieldArray(arr, collectionSlug, opts)
        }
      }
    }
  }

  file.saveSync()
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test:unit -- codemods/i18n
```

- [ ] **Step 5: Commit**

```bash
git add scripts/codemods/i18n.ts scripts/codemods/i18n.test.ts
git commit -m "feat(codemod): add i18n field localized:true codemod with denylist + overrides"
```

---

### Task 50: `scripts/starter-sync.ts` orchestration

**Files:**
- Create: `scripts/starter-sync.ts`

- [ ] **Step 1: Write `scripts/starter-sync.ts`**

```ts
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
  { slug: 'case-studies', file: 'src/collections/CaseStudies/index.ts' },
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
      'rerun with --confirm-locale-shrink (this generates a destructive migration).'
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

console.log('\n[starter:sync] done. Review the migration in src/migrations/ before running `pnpm migrate`.')
```

- [ ] **Step 2: Verify command works**

Edit `starter.config.ts` to set `locales: ['en', 'es']`, then run:

```bash
pnpm starter:sync
```

Expected: codemod logs each collection processed, types regenerated, migration created in `src/migrations/`. Inspect the migration file before applying.

Revert `starter.config.ts` to `['en']` for now (we don't want to commit multi-locale state).

- [ ] **Step 3: Commit**

```bash
git add scripts/starter-sync.ts
git commit -m "feat(starter): add pnpm starter:sync (codemod + types + migration pipeline)"
```

**Phase 10 Checkpoint:** Switching `i18n.locales` and running `pnpm starter:sync` patches collection field configs and creates a migration.

---

## Phase 11 — Seed Scripts

### Task 51: Seed orchestrator + sample data

**Files:**
- Create: `scripts/seed.ts`
- Create: `scripts/seed-data/pages.ts`
- Create: `scripts/seed-data/blog.ts`
- Create: `scripts/seed-data/case-studies.ts`
- Create: `scripts/reset-db.ts`

- [ ] **Step 1: `scripts/seed-data/pages.ts`** (returns block payloads)

```ts
export const samplePages = [
  {
    slug: 'home',
    title: 'Home',
    _status: 'published' as const,
    blocks: [
      { blockType: 'hero', heading: 'Build any project, fast.', subheading: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Payload + Next.js starter with sensible defaults.' }] }] } }, ctas: [{ link: { type: 'custom', url: '/about', label: 'Learn more' } }] },
      { blockType: 'feature-grid', heading: 'Everything included', columns: '3', items: [
        { title: 'Typed config', description: 'One file controls every project-level choice.' },
        { title: 'Optional providers', description: 'Switch DB, storage, email without touching code.' },
        { title: '13 generic blocks', description: 'Ready-to-use building blocks.' },
      ] },
    ],
  },
  {
    slug: 'about',
    title: 'About',
    _status: 'published' as const,
    blocks: [
      { blockType: 'hero', heading: 'About this starter' },
      { blockType: 'rich-text-block', maxWidth: 'prose', content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'A starter for any Payload + Next.js project.' }] }] } } },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    _status: 'published' as const,
    blocks: [
      { blockType: 'hero', heading: 'Get in touch' },
    ],
  },
]
```

- [ ] **Step 2: `scripts/seed-data/blog.ts`**

```ts
export const sampleBlogPosts = [
  { slug: 'welcome', title: 'Welcome to the starter', excerpt: 'A quick tour of the included blocks.', _status: 'published' as const, content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Body of the welcome post.' }] }] } } },
  { slug: 'why-payload', title: 'Why Payload CMS', excerpt: 'Reasons for choosing Payload as the CMS.', _status: 'published' as const, content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Payload is type-safe, code-first, and self-hostable.' }] }] } } },
  { slug: 'starter-config', title: 'Configuring the starter', excerpt: 'How starter.config.ts works.', _status: 'published' as const, content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Walk through each section.' }] }] } } },
]

export const sampleCategories = [
  { slug: 'tutorial', title: 'Tutorial' },
  { slug: 'announcement', title: 'Announcement' },
  { slug: 'engineering', title: 'Engineering' },
]

export const sampleTags = [
  { slug: 'starter', title: 'Starter' },
  { slug: 'payload', title: 'Payload' },
  { slug: 'next-js', title: 'Next.js' },
  { slug: 'tutorial', title: 'Tutorial' },
  { slug: 'cms', title: 'CMS' },
]
```

- [ ] **Step 3: `scripts/seed-data/case-studies.ts`**

```ts
export const sampleCaseStudies = [
  {
    slug: 'acme-corp-redesign',
    title: 'Acme Corp Website Redesign',
    excerpt: 'Rebuilding marketing site on Payload + Next.js.',
    client: 'Acme Corp',
    industry: 'SaaS',
    duration: '3 months',
    services: [{ name: 'Web Design' }, { name: 'CMS Implementation' }, { name: 'Performance' }],
    _status: 'published' as const,
    content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Body of the case study.' }] }] } },
  },
  {
    slug: 'beta-co-content-platform',
    title: 'Beta Co Content Platform',
    excerpt: 'Editorial workflows and multilingual publishing.',
    client: 'Beta Co',
    industry: 'Media',
    duration: 'Q1 2025',
    services: [{ name: 'Editorial Tooling' }, { name: 'i18n' }],
    _status: 'published' as const,
    content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Body of the case study.' }] }] } },
  },
]
```

- [ ] **Step 4: `scripts/seed.ts`**

```ts
#!/usr/bin/env tsx
import { getPayload } from 'payload'
import config from '../src/payload.config'
import starterConfig from '../starter.config'
import { samplePages } from './seed-data/pages'
import { sampleBlogPosts, sampleCategories, sampleTags } from './seed-data/blog'
import { sampleCaseStudies } from './seed-data/case-studies'

const RESET = process.argv.includes('--reset')

async function ensureAdmin(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (process.env.NODE_ENV === 'production') return
  const existing = await payload.find({ collection: 'users', where: { email: { equals: 'admin@example.com' } }, limit: 1 })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@example.com', password: 'admin1234', name: 'Admin', role: 'admin' },
    })
    console.log(' ✓ admin user (admin@example.com / admin1234)')
  }
}

async function clear<T extends 'pages' | 'blog' | 'case-studies' | 'categories' | 'tags'>(payload: Awaited<ReturnType<typeof getPayload>>, slug: T) {
  const all = await payload.find({ collection: slug, limit: 500 })
  for (const doc of all.docs) await payload.delete({ collection: slug, id: doc.id })
}

async function main() {
  const payload = await getPayload({ config })

  if (RESET) {
    console.log('[seed:reset] clearing collections...')
    if (starterConfig.collections.tags) await clear(payload, 'tags')
    if (starterConfig.collections.categories) await clear(payload, 'categories')
    if (starterConfig.collections.blog) await clear(payload, 'blog')
    if (starterConfig.collections.caseStudies) await clear(payload, 'case-studies')
    await clear(payload, 'pages')
  }

  await ensureAdmin(payload)

  console.log('[seed] pages...')
  for (const p of samplePages) {
    await payload.create({ collection: 'pages', data: p as any })
  }

  if (starterConfig.collections.categories) {
    console.log('[seed] categories...')
    for (const c of sampleCategories) await payload.create({ collection: 'categories', data: c })
  }

  if (starterConfig.collections.tags) {
    console.log('[seed] tags...')
    for (const t of sampleTags) await payload.create({ collection: 'tags', data: t })
  }

  if (starterConfig.collections.blog) {
    console.log('[seed] blog posts...')
    for (const post of sampleBlogPosts) await payload.create({ collection: 'blog', data: post as any })
  }

  if (starterConfig.collections.caseStudies) {
    console.log('[seed] case studies...')
    for (const cs of sampleCaseStudies) await payload.create({ collection: 'case-studies', data: cs as any })
  }

  console.log('\n[seed] done.')
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
```

- [ ] **Step 5: `scripts/reset-db.ts`**

```ts
#!/usr/bin/env tsx
import { execSync } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('This will DROP all data. Type "yes" to continue: ', (answer) => {
  rl.close()
  if (answer.trim() !== 'yes') {
    console.log('Aborted.')
    process.exit(0)
  }
  console.log('Running migrate:fresh...')
  execSync('pnpm payload migrate:fresh', { stdio: 'inherit' })
})
```

- [ ] **Step 6: Run seed**

```bash
pnpm seed
```

Expected: admin user created (or skipped if exists), pages/blog/case-studies/categories/tags populated.

- [ ] **Step 7: Commit**

```bash
git add scripts/seed.ts scripts/seed-data scripts/reset-db.ts
git commit -m "feat(scripts): add seed and reset-db scripts"
```

**Phase 11 Checkpoint:** `pnpm seed` populates working sample content. `/`, `/about`, `/contact`, `/blog`, `/case-studies` all show seeded content.

---

## Phase 12 — Tests

### Task 52: Unit tests sweep

The adapters and codemod already have unit tests (Tasks 8–11, 49). This task adds tests for utilities (slug, getTranslations) and a sample component test.

**Files:**
- Create: `src/fields/slug.test.ts`
- Create: `src/utilities/getTranslations.test.ts`
- Create: `src/blocks/Hero/Component.test.tsx`

- [ ] **Step 1: `src/fields/slug.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { slugField } from './slug'

describe('slugField', () => {
  it('returns a Field with hooks', () => {
    const field = slugField('title') as { name: string; hooks?: { beforeValidate?: unknown[] } }
    expect(field.name).toBe('slug')
    expect(field.hooks?.beforeValidate).toHaveLength(1)
  })
})
```

- [ ] **Step 2: `src/utilities/getTranslations.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('payload', () => ({ getPayload: vi.fn(async () => ({ findGlobal: vi.fn() })) }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }))
vi.mock('@/i18n/config', () => ({ isMultiLocale: false }))

import { getTranslations } from './getTranslations'

describe('getTranslations', () => {
  it('returns English fallback when single-locale', async () => {
    const t = await getTranslations('en')
    expect(t.navigation.home).toBe('Home')
  })
})
```

- [ ] **Step 3: `src/blocks/Hero/Component.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroBlock } from './Component'

describe('HeroBlock', () => {
  it('renders heading', () => {
    render(<HeroBlock block={{ blockType: 'hero', heading: 'Hello world', id: '1' } as any} />)
    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeDefined()
  })
})
```

- [ ] **Step 4: Run tests**

```bash
pnpm test:unit
```

Expected: all tests pass (adapters, codemod, slug, getTranslations, Hero component).

- [ ] **Step 5: Commit**

```bash
git add src/fields/slug.test.ts src/utilities/getTranslations.test.ts src/blocks/Hero/Component.test.tsx
git commit -m "test: add unit tests for slug, getTranslations, Hero component"
```

---

### Task 53: Playwright smoke E2E

**Files:**
- Create: `tests/e2e/admin.spec.ts`
- Create: `tests/e2e/frontend.spec.ts`
- Create: `tests/e2e/sitemap.spec.ts`

- [ ] **Step 1: `tests/e2e/admin.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('admin login page loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin/)
  await expect(page.getByText(/login|create.*first.*user/i)).toBeVisible({ timeout: 10000 })
})
```

- [ ] **Step 2: `tests/e2e/frontend.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('home renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
})

test('blog list renders', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
})

test('case studies list renders', async ({ page }) => {
  await page.goto('/case-studies')
  await expect(page.getByRole('heading', { name: 'Case Studies' })).toBeVisible()
})
```

- [ ] **Step 3: `tests/e2e/sitemap.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('sitemap.xml returns 200', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBeLessThan(400)
})
```

- [ ] **Step 4: Run E2E (requires DB seeded)**

```bash
pnpm test:e2e
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e
git commit -m "test(e2e): add admin, frontend, sitemap smoke tests"
```

**Phase 12 Checkpoint:** `pnpm test` runs unit + E2E and exits 0.

---

## Phase 13 — Docker, Deployment, `.env.example`

### Task 54: `Dockerfile` + compose files

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.sqlite.yml`

- [ ] **Step 1: `Dockerfile`**

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/payload-types.ts ./src/payload-types.ts
COPY --from=builder /app/starter.config.ts ./starter.config.ts
COPY --from=builder /app/src/migrations ./src/migrations
EXPOSE 3000
CMD ["pnpm", "start"]
```

- [ ] **Step 2: `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: payload_starter
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']
  app:
    build: .
    depends_on: [postgres]
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/payload_starter
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: http://localhost:3000
    ports: ['3000:3000']
volumes:
  pgdata:
```

- [ ] **Step 3: `docker-compose.sqlite.yml`**

```yaml
services:
  app:
    build: .
    environment:
      DATABASE_URL: file:/app/data/local.db
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: http://localhost:3000
    ports: ['3000:3000']
    volumes: ['sqlitedata:/app/data']
volumes:
  sqlitedata:
```

- [ ] **Step 4: Commit**

```bash
git add Dockerfile docker-compose.yml docker-compose.sqlite.yml
git commit -m "feat(docker): add Dockerfile and compose configs (postgres + sqlite)"
```

---

### Task 55: `vercel.json`, `next-sitemap.config.cjs`, `.env.example`

**Files:**
- Create: `vercel.json`
- Create: `next-sitemap.config.cjs`
- Create: `.env.example`
- Modify: `package.json` to add `postbuild: "next-sitemap"` script

- [ ] **Step 1: `vercel.json`**

```json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

- [ ] **Step 2: `next-sitemap.config.cjs`**

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api/*'],
}
```

- [ ] **Step 3: Add `postbuild` to `package.json` scripts**

```json
"postbuild": "next-sitemap"
```

- [ ] **Step 4: Write `.env.example`** (full content from spec §22; copy literally from the design spec).

- [ ] **Step 5: Commit**

```bash
git add vercel.json next-sitemap.config.cjs .env.example package.json
git commit -m "feat: add vercel.json, sitemap config, .env.example"
```

**Phase 13 Checkpoint:** `pnpm build && pnpm start` works. `docker compose up` boots the full stack. `.env.example` is the canonical reference for env vars.

---

## Phase 14 — README, License, Final Validation

### Task 56: `LICENSE` + `README.md`

**Files:**
- Create: `LICENSE`
- Create: `README.md`

- [ ] **Step 1: `LICENSE` — MIT**

```
MIT License

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy ...
[full MIT text]
```

(Use the standard MIT license text from <https://opensource.org/license/mit>.)

- [ ] **Step 2: `README.md`** (sections from spec §23). Cover: tech stack, quick start (3 env vars + install + dev + seed), `starter.config.ts` walkthrough, `pnpm starter:sync` usage, adding a block, adding a Lexical feature, switching providers, deployment paths, testing, license. Aim for ~400 lines, every section actionable.

- [ ] **Step 3: Commit**

```bash
git add LICENSE README.md
git commit -m "docs: add LICENSE and README"
```

---

### Task 57: Final validation against spec §25 success criteria

Verify each success criterion from the spec is met. For each item, run the verification command and check the output.

- [ ] **1. Clean install**

```bash
rm -rf node_modules .next
pnpm install
cp .env.example .env
# fill PAYLOAD_SECRET, DATABASE_URL, NEXT_PUBLIC_SERVER_URL
pnpm dev
```

Expected: dev server starts on port 3000.

- [ ] **2. Default config boots without errors**

`starter.config.ts` defaults: `database.provider: 'postgres'`, `storage.provider: 'local'`, `email.provider: 'console'`, `i18n.locales: ['en']`, `features.gsap: false`, `features.swiper: true`, `features.charts: true`. With these defaults and the 3 required env vars set, `pnpm dev` boots and admin loads.

- [ ] **3. `pnpm seed` populates content**

```bash
pnpm seed
```

Expected: admin user, 3 pages, 3 blog posts, 2 case studies, 3 categories, 5 tags created.

- [ ] **4. Admin login + all blocks selectable**

Visit `http://localhost:3000/admin`, log in (`admin@example.com` / `admin1234`), open the Home page, verify all 13 (or 11 with default toggles) blocks appear in the block-picker grouped by `admin.group`.

- [ ] **5. Frontend routes return 200**

```bash
for path in / /about /contact /blog /case-studies /sitemap.xml; do
  echo -n "$path -> "; curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000$path
done
```

Expected: all 200 (or 308 redirect to slug pages).

- [ ] **6. Multi-locale toggle**

Edit `starter.config.ts` `i18n.locales` to `['en', 'es']`, run `pnpm starter:sync`, verify migration created in `src/migrations/`. Run `pnpm migrate`, restart dev server, see language switcher in header.

Revert to `['en']` after verification (no commit of multi-locale state in starter).

- [ ] **7. SQLite switch**

Edit `starter.config.ts` `database.provider` to `'sqlite'`, set `DATABASE_URL=file:./local.db`, run `pnpm migrate:create --name=switch-sqlite && pnpm migrate`, then `pnpm dev`. Admin loads, can create a Page.

Revert to Postgres for the committed default state.

- [ ] **8. S3 switch (if S3 credentials available)**

Edit `starter.config.ts` `storage.provider` to `'s3'`, set the 4 S3 env vars, restart, upload a media file, verify it lands in S3.

(Skip-able if no S3 creds; document outcome.)

- [ ] **9. `pnpm test` passes**

```bash
pnpm test
```

Expected: all unit and E2E tests pass.

- [ ] **10. README walks through zero-to-running**

Self-review the README with fresh eyes. From a brand-new clone, can a dev follow the Quick Start to a running site in under 10 minutes? If any step is ambiguous or missing context, fix.

- [ ] **Step 11: Final commit**

```bash
git add -A
git commit -m "chore: final validation against success criteria"
```

**Phase 14 Checkpoint:** Starter is complete. The repo is shippable.

---

## Self-Review

**Spec coverage:** Every section of `2026-04-28-payload-starter-design.md` has a corresponding task or set of tasks:

| Spec section | Plan task(s)         |
|--------------|----------------------|
| §1 Goal      | Phase 14 validates   |
| §2 Architecture| Task 1, 13, 17     |
| §3 starter.config.ts | Tasks 5–7      |
| §4 DB Adapters | Task 8             |
| §5 Storage Adapters | Task 9          |
| §6 Email Adapters | Task 10           |
| §7 i18n Strategy | Tasks 43, 44, 49–50 |
| §8 starter:sync | Tasks 49, 50       |
| §9 Lexical | Tasks 18–21              |
| §10 13 Blocks | Tasks 22–38          |
| §11 Pages | Tasks 24, 25, 38         |
| §12 Blog | Task 40                   |
| §13 CaseStudies | Task 41             |
| §14 Categories+Tags | Task 39         |
| §15 Users | Tasks 14, 15             |
| §16 Plugins | Tasks 11, 47, 48       |
| §17 Seed | Task 51                   |
| §18 Tests | Tasks 4, 8–11, 49, 52, 53 |
| §19 Docker | Task 54                  |
| §20 Deployment | Tasks 55, 56         |
| §21 Repo hygiene | Tasks 1, 2, 56     |
| §22 .env.example | Task 55            |
| §23 README | Task 56                  |
| §25 Success criteria | Task 57          |

**Type consistency:** `StarterConfig` from `src/starter/types.ts` is imported and consumed identically in every adapter file, plugins.ts, collections.ts, i18n.ts, payload.config.ts, and starter-sync.ts. Block component types use `Extract<NonNullable<Page['blocks']>[number], { blockType: '...' }>` consistently.

**Placeholder scan:** All TDD steps have full code. All commands have expected outputs where verifiable. The only deferred concrete content is the README body in Task 56 (sections enumerated but body left for the executor; this is intentional — README copy is human writing, not mechanical translation).

---

## Execution Notes

**Worktree / isolation:** This plan runs in `~/Work/payload-starter/`, an empty git repo. **No changes** are made to `~/Work/payload-test/`.

**Subagent dispatch order:**
- **Wave 1 (no DB needed, parallelizable):** Tasks 1–4 (must be sequential, share package.json)
- **Wave 2:** Tasks 5–7 (sequential)
- **Wave 3:** Tasks 8–13 (Tasks 8/9/10 parallel; 11 after 10; 12 after 11; 13 sequential)
- **Wave 4:** Tasks 14–17 (sequential, last needs DB)
- **DB checkpoint:** user must have Postgres running (or switch starter.config.ts to sqlite + set DATABASE_URL=file:./local.db)
- **Wave 5:** Tasks 18–21 (sequential)
- **Wave 6:** Tasks 22–37 (Task 22 first; then 23–37 each block can be a separate subagent in parallel)
- **Wave 7:** Task 38 (sequential, depends on all blocks)
- **Wave 8:** Tasks 39–41 (parallelizable)
- **Wave 9:** Tasks 42–46 (sequential within phase, sub-tasks can branch)
- **Wave 10:** Tasks 47–50 (sequential)
- **Wave 11:** Task 51 (needs DB)
- **Wave 12:** Tasks 52–53 (parallel)
- **Wave 13:** Tasks 54–55 (parallel)
- **Wave 14:** Tasks 56–57 (sequential)











