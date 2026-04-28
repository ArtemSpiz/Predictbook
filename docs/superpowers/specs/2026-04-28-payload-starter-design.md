# Payload Starter — Design Spec

**Date:** 2026-04-28
**Author:** brainstormed with Claude
**Target location:** `~/Work/payload-starter/` (new repository, not derived from `payload-test` git history)

## 1. Goal

Create a domain-agnostic Payload CMS 3.x + Next.js 15 starter that bootstraps any new project with one command. The starter inherits architectural patterns from `payload-test` (i18n, SEO utilities, Lexical features, block patterns, plugin set) but contains zero business-domain code (no sportsbook blocks, no Vacancies/CV/Articles collections, no DATA.BET-specific UI).

The starter is **opinionated about patterns, flexible about providers** — every choice that varies between projects (DB, storage, email, hosting, CDN, GSAP/Swiper, multilingualism, charts) is configured in one typed file: `starter.config.ts`.

## 2. Architecture Overview

```
payload-starter/
├── starter.config.ts            # Single source of truth for project-level choices
├── .env.example                 # Documented env vars, grouped by required/optional
├── src/
│   ├── payload.config.ts        # Reads starter.config.ts, wires adapters/plugins/locales
│   ├── starter/                 # Starter-specific runtime: config loader, types, adapters
│   ├── collections/             # Pages, Users, Media, Blog, CaseStudies, Categories, Tags
│   ├── blocks/                  # 13 generic blocks (with admin.group + imageURL)
│   ├── fields/                  # defaultLexical, wideMarkupLexical, link, slug helpers
│   ├── features/                # Custom Lexical features (one example included)
│   ├── globals/                 # Header, Footer, Translations (Translations only when locales > 1)
│   ├── utilities/               # seo, getGlobals, getMediaUrl, getTranslations
│   ├── i18n/                    # config.ts + locale fallback JSON files
│   └── app/(frontend) / (payload)
├── scripts/
│   ├── starter-sync.ts          # `pnpm starter:sync` — codemod + types + migration
│   ├── codemods/i18n.ts         # AST codemod for localized: true
│   ├── seed.ts                  # `pnpm seed` — populate sample content
│   └── reset-db.ts              # `pnpm db:reset`
├── public/blocks/               # Placeholder PNGs for block picker (one per block)
├── tests/                       # vitest unit + playwright e2e (smoke only)
├── Dockerfile + docker-compose.yml
└── docs/                        # README + DEPLOYMENT + RECIPES
```

## 3. `starter.config.ts` — Central Config

Single typed file at repo root. Read at build-time by `payload.config.ts`, `next.config.js`, layout components, and the `pnpm starter:sync` script.

```ts
import { defineStarterConfig } from './src/starter/define'

export default defineStarterConfig({
  // === Database ===
  database: {
    provider: 'postgres',                  // 'postgres' | 'sqlite'
    // url is read from env: DATABASE_URL
  },

  // === Storage ===
  storage: {
    provider: 'local',                     // 'local' | 's3' | 'gcs' | 'vercel-blob'
    // local: files saved to public/media
    // s3: reads S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
    // gcs: reads GCS_BUCKET, GOOGLE_APPLICATION_CREDENTIALS
    // vercel-blob: reads BLOB_READ_WRITE_TOKEN
  },

  // === CDN (optional) ===
  cdn: {
    url: process.env.NEXT_PUBLIC_CDN_URL,  // env-reference allowed
  },

  // === Email ===
  email: {
    provider: 'console',                   // 'console' | 'resend' | 'smtp' | 'sendgrid'
    from: 'noreply@example.com',
    // console: logs to terminal in dev
    // resend: reads RESEND_API_KEY
    // smtp: reads SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
    // sendgrid: reads SENDGRID_API_KEY
  },

  // === i18n ===
  i18n: {
    locales: ['en'],                       // length === 1 → single-locale mode
    defaultLocale: 'en',
    skipFields: [],                        // 'collectionSlug.fieldName' overrides for codemod
    forceFields: [],
    skipCollections: [],
  },

  // === Features (toggles for optional dependencies/blocks) ===
  features: {
    gsap: false,                           // animation library; if false, GSAP not imported, Stats/StatsChart fall back to CSS/RAF
    swiper: true,                          // carousels; if false, LogoCloud renders as static grid, Testimonials disabled
    charts: true,                          // Recharts + StatsChart block; if false, block not registered
    livePreview: true,                     // Payload live-preview admin feature
    seo: true,                             // @payloadcms/plugin-seo
    redirects: true,                       // @payloadcms/plugin-redirects
    search: true,                          // @payloadcms/plugin-search
    formBuilder: true,                     // @payloadcms/plugin-form-builder
    nestedDocs: true,                      // @payloadcms/plugin-nested-docs
    importExport: true,                    // @payloadcms/plugin-import-export
    auditLog: false,                       // @ghosthaise/payload-audit-log
  },

  // === Collections (toggle entire content types) ===
  collections: {
    blog: true,
    caseStudies: true,
    categories: true,                      // helper for blog/case-studies
    tags: true,                            // helper for blog
  },
})
```

**`defineStarterConfig`** is a typed identity function — no runtime, just IntelliSense and type-narrowing.

**Wiring rule:** `payload.config.ts` imports `starterConfig`, then conditionally constructs the `payload` config:

```ts
import starterConfig from '../starter.config'
import { resolveDbAdapter } from './starter/adapters/db'
import { resolveStorageAdapter } from './starter/adapters/storage'
import { resolveEmailAdapter } from './starter/adapters/email'
import { buildPlugins } from './starter/plugins'
import { buildCollections } from './starter/collections'

export default buildConfig({
  db: resolveDbAdapter(starterConfig.database),
  email: resolveEmailAdapter(starterConfig.email),
  collections: buildCollections(starterConfig),
  plugins: [
    resolveStorageAdapter(starterConfig.storage),
    ...buildPlugins(starterConfig.features),
  ],
  localization: starterConfig.i18n.locales.length > 1
    ? { locales: starterConfig.i18n.locales, defaultLocale: starterConfig.i18n.defaultLocale, fallback: true }
    : undefined,
  // ...
})
```

## 4. Database Adapters

Two providers, both via Payload official adapters:

- **postgres** → `@payloadcms/db-postgres` with Drizzle. Migrations in `src/migrations/`.
- **sqlite** → `@payloadcms/db-sqlite` with Drizzle. Migrations in `src/migrations/`.

`resolveDbAdapter()` returns the right adapter based on `provider`. `DATABASE_URL` env var format: `postgres://...` for Postgres, `file:./local.db` for SQLite.

`pnpm migrate` and `pnpm migrate:create` work for both providers (Payload auto-detects from adapter).

## 5. Storage Adapters

Four providers, each through official Payload storage plugin:

- **local** (default) — files saved to `public/media`, served as static assets
- **s3** — `@payloadcms/storage-s3`
- **gcs** — `@payloadcms/storage-gcs`
- **vercel-blob** — `@payloadcms/storage-vercel-blob`

`resolveStorageAdapter()` returns the appropriate plugin (or no-op for `local`). The `media` collection's `upload.staticDir` and URL prefix vary based on provider + optional `cdn.url`.

Cloudflare R2 uses S3 provider with custom endpoint — documented in README, no separate adapter.

## 6. Email Adapters

Four providers, each returning a Payload-compatible email adapter:

- **console** (default) — logs email content to terminal; safe default for dev (no SDK, just an inline adapter that calls `console.log`)
- **resend** — `@payloadcms/email-resend` (official Payload adapter)
- **smtp** — `@payloadcms/email-nodemailer` configured with SMTP transport
- **sendgrid** — `@payloadcms/email-nodemailer` configured with `nodemailer-sendgrid` transport (or direct `@sendgrid/mail`; chosen at implementation time based on which gives a cleaner adapter)

`resolveEmailAdapter()` returns the proper Payload email adapter. `from` address comes from config; per-message `to/subject/body` from caller. Exact package selection for sendgrid is decided in the implementation plan — the spec requires only that the four `provider` values produce working email delivery.

## 7. i18n Strategy

**Source of truth:** the `locales` array length. `locales: ['en']` → single-locale mode (no `localized: true` on fields, no Translations global, no language switcher). `locales: ['en', 'es']` → multi-locale mode.

**Single-locale mode (default):**
- Payload `localization` config NOT set
- Fields are plain `text`/`richText` without `localized: true`
- No Translations global registered
- Header has no language switcher

**Multi-locale mode:**
- Payload `localization` enabled with the configured locales
- Fields marked `localized: true` (via codemod, see §8)
- Translations global registered
- Header renders language switcher (cookie-based: `NEXT_LOCALE`)
- JSON fallback files at `src/i18n/locales/<locale>.json` for build-time strings

The infrastructure (cookie middleware, `getTranslations` utility, language switcher component) is **always present in code** but inert when `locales.length === 1`.

## 8. `pnpm starter:sync` — Codemod + Migration Pipeline

Single command synchronizes code with `starter.config.ts`. Pipeline:

1. Load `starter.config.ts`.
2. **i18n codemod** (`scripts/codemods/i18n.ts` using `ts-morph`):
   - For each collection field, decide whether to add/remove `localized: true`:
     - **Skip if** field name in built-in denylist: `slug`, `email`, `url`, `phone`, `_status`, `role`, `password`, `id`, `key`, `code`, `provider`, `iconName`, `staticURL`
     - **Skip if** field has `unique: true`
     - **Skip if** field type is not `text | textarea | richText | select`
     - **Skip if** `i18n.skipFields` includes `<collectionSlug>.<fieldName>`
     - **Skip if** `i18n.skipCollections` includes `<collectionSlug>`
     - **Force add if** `i18n.forceFields` includes `<collectionSlug>.<fieldName>`
   - If `locales.length > 1`: add `localized: true` where missing.
   - If `locales.length === 1` (or shrunk from N → fewer): codemod does NOT auto-remove `localized: true` — removing localization on existing data drops non-default-locale columns and is destructive. Codemod prints a warning listing fields that could be unflagged and exits unless invoked with explicit `--confirm-locale-shrink` flag, in which case `localized: true` is removed and a destructive migration is generated.
3. Run `payload generate:types` to refresh `src/payload-types.ts`.
4. Run `payload migrate:create --name="starter-sync-<timestamp>"` to generate migration for schema changes.
5. Print summary: which fields changed, which migration file was created.

`pnpm starter:sync` script lives at `scripts/starter-sync.ts` and is invoked via `package.json`:

```json
"scripts": {
  "starter:sync": "tsx scripts/starter-sync.ts"
}
```

## 9. Lexical Editor — Two Presets + Easy Extension

Two reusable Lexical editor configs (preserved from `payload-test`):

- **`defaultLexical`** — minimal: Paragraph, Heading (h1-h6), Bold/Italic/Underline, Link (configurable enabled collections). Used for short content (excerpts, descriptions).
- **`wideMarkupLexical`** — full: Default + Blockquote, Lists (ordered/unordered/checklist), Table, FixedToolbar/InlineToolbar, Strikethrough/Sub/Sup/InlineCode, Align/Indent, Relationship, Upload (with altText override), HorizontalRule, TextState (named colors), plus example custom feature.

**Custom features pattern** at `src/features/<feature-name>/`:
```
features/<name>/
├── feature.server.ts    # Server-side feature definition
├── feature.client.tsx   # Client-side React components for toolbar
└── components/          # Optional: nodes, plugins, UI
```

One **example feature** ships with the starter — `src/features/highlight/` — small fully-working feature showing the entire pattern (server config + client toolbar button + custom node + decorator). New feature checklist:

1. Copy `features/highlight/` to `features/<your-feature>/`.
2. Update `feature.server.ts` and `feature.client.tsx`.
3. Import in `src/fields/wideMarkupLexical.ts` and add to `features` array.
4. (Optional) add to `defaultLexical` if appropriate for short content too.

README has a 1-page guide.

## 10. Generic Blocks — 13 Blocks

All blocks under `src/blocks/<BlockName>/`, each with:
- `config.ts` — Payload `Block` definition with `slug`, `imageURL: '/blocks/<slug>.png'`, `imageAltText`, `admin.group: '<group>'`
- `Component.tsx` (server) and/or `Component.client.tsx` (client) — React component
- Imported in `src/blocks/RenderBlocks.tsx`
- Registered in `src/collections/Pages` `blocks` field

Roster grouped by `admin.group`:

**Hero & CTA:**
1. **Hero** — heading + subheading + CTA button(s) + optional bg image/video
2. **CallToAction** — heading + description + 1-2 buttons + optional bg

**Content:**
3. **RichTextBlock** — full-width rich text using `wideMarkupLexical`
4. **MediaWithText** — image/video + rich text, left/right variants
5. **ContentMedia** — multiple alternating media+text sections in one block
6. **TextColumns** — rich text split into N columns (N = 2/3/4, configurable per block instance)

**Lists & Grids:**
7. **FeatureGrid** — N cards (icon + title + description), 2/3/4 columns
8. **ImageGrid** — image gallery in X columns (X = 2/3/4/6, configurable)
9. **LogoCloud** — partner/logo grid; static if `features.swiper: false`, carousel if true

**Social Proof:**
10. **Testimonials** — quote slider; only registered if `features.swiper: true`
11. **FAQ** — Q&A accordion (rich text answers)

**Data & Stats:**
12. **Stats** — N metric cards (value + label + description), counter-up animation (CSS/RAF if no GSAP)
13. **StatsChart** — Recharts line/bar/area/donut + optional stat callouts; only registered if `features.charts: true`

Each block ships a placeholder image at `public/blocks/<slug>.png` (a generic 200×120 PNG with the block name). Real designs replace these.

## 11. Pages Collection

`src/collections/Pages/index.ts`:
- `slug: 'pages'`
- Fields: `title`, `slug` (auto-generated, unique), `parent` (if `nestedDocs` enabled), `breadcrumbs` (auto-generated), `blocks` (the 13 blocks above), SEO tab (if `seo` enabled)
- `versions: { drafts: true }` enabled
- Live preview URL set via `livePreview` config
- Access: read public, write admin/editor

Sample seeded pages: `home` (Hero + FeatureGrid + Testimonials + CTA), `about` (Hero + RichTextBlock + Stats + ContentMedia), `contact` (Hero + ContactFormBlock-from-formBuilder + RichTextBlock with location).

## 12. Blog Collection

`src/collections/Blog/index.ts` — registered if `collections.blog: true`. Fields:

- `title` (text, required)
- `slug` (text, required, unique, auto-generated)
- `excerpt` (textarea)
- `coverImage` (upload → media)
- `content` (richText, `wideMarkupLexical`)
- `author` (relationship → users)
- `categories` (relationship → categories, hasMany) — only if `collections.categories: true`
- `tags` (relationship → tags, hasMany) — only if `collections.tags: true`
- `publishedAt` (date)
- SEO tab — if `features.seo: true`

`versions: { drafts: true }` enabled. `_status: published | draft` automatic.

Frontend routes:
- `/blog` — paginated list, filter by category/tag query params
- `/blog/[slug]` — single post
- `/blog/category/[slug]` — posts filtered by category
- `/blog/tag/[slug]` — posts filtered by tag

## 13. Case Studies Collection

`src/collections/CaseStudies/index.ts` — registered if `collections.caseStudies: true`. Fields:

- `title`, `slug`, `excerpt`, `coverImage` — same as Blog
- `client` (text) — client name
- `industry` (text) — industry label
- `services` (array of text) — services delivered
- `duration` (text) — engagement duration
- `content` (richText, `wideMarkupLexical`)
- `relatedCaseStudies` (relationship → case-studies, hasMany)
- `publishedAt` (date)
- SEO tab — if `features.seo: true`

**No `metrics` field** (excluded per user decision).

`versions: { drafts: true }` enabled.

Frontend routes:
- `/case-studies` — grid, filter by industry/service
- `/case-studies/[slug]` — single

## 14. Categories & Tags

Helper collections — registered only if their toggles are on AND at least one parent collection (Blog/CaseStudies) needs them.

- **Categories** (`categories`): `title`, `slug`, `description` (textarea)
- **Tags** (`tags`): `title`, `slug`

Both support drafts off (immediately public). Used as relationship targets only.

## 15. Users & Auth

`src/collections/Users.ts`:
- Payload built-in `auth: true`
- Fields: `email`, `name`, `role` (select: `admin | editor`)
- Access functions:
  - `admin` → full access
  - `editor` → read all, write Pages/Blog/CaseStudies/Media, no user management
- Default seeded user (only when `NODE_ENV !== 'production'`): `admin@example.com` / `admin`

No separate `Roles` or `Permissions` collections (kept simple).

## 16. Plugin Set

All toggle-able via `features.X`. When toggle is `false`, plugin not added to `payload.config.ts` plugins array, package can be removed from dependencies (or kept if user might enable later).

| Feature toggle    | Plugin                              | Default |
|-------------------|-------------------------------------|---------|
| `seo`             | `@payloadcms/plugin-seo`            | on      |
| `redirects`       | `@payloadcms/plugin-redirects`      | on      |
| `search`          | `@payloadcms/plugin-search`         | on      |
| `formBuilder`     | `@payloadcms/plugin-form-builder`   | on      |
| `nestedDocs`      | `@payloadcms/plugin-nested-docs`    | on      |
| `importExport`    | `@payloadcms/plugin-import-export`  | on      |
| `auditLog`        | `@ghosthaise/payload-audit-log`     | off     |

`buildPlugins(features)` returns the array, filtering by toggles.

## 17. Seed Scripts

- `pnpm seed` — populates database with: 1 admin user + 3 sample pages (home/about/contact) + 5 blog posts + 2 case studies + 3 categories + 5 tags + 2 redirects + 1 sample form (from form-builder).
- `pnpm seed:reset` — drops all data, re-runs `seed`.
- `pnpm db:reset` — drops DB schema (dangerous, dev-only), runs migrations.

Seed reads `starter.config.ts` to skip seeding for disabled collections (e.g., if `collections.blog: false`, no blog posts seeded).

## 18. Testing

- **Vitest** + **React Testing Library** + **jsdom** — unit tests for utilities (codemod, adapters, slug generation, SEO helpers) and small React component tests.
- **Playwright** — minimal smoke E2E:
  - Admin login at `/admin`
  - Frontend home page loads
  - `/sitemap.xml` returns 200
  - `/blog` loads (if blog enabled)
- CI configs work with SQLite (faster, no Postgres needed in GitHub Actions).

Test files coexist with source: `*.test.ts(x)` next to module. E2E tests in `tests/e2e/`.

## 19. Docker & docker-compose

- `Dockerfile` — multi-stage Next.js production build
- `docker-compose.yml` — Postgres 16 + Next.js + (optional) MinIO for S3-emulation in dev
- `docker-compose.sqlite.yml` — alternative compose without DB service (volume-mounted SQLite file)

Documented in README. Default `pnpm dev` does not use Docker; Docker is only for prod-like local testing or self-hosted deployment.

## 20. Deployment Recipes (README)

Three documented paths, each with checklist + env vars + gotchas:

1. **Vercel** — Postgres via Vercel Postgres or Neon, Vercel Blob storage, Resend email
2. **Railway** — Postgres + storage on same platform, Resend email
3. **Self-hosted Docker** — local Postgres, S3-compatible storage (MinIO/R2), SMTP email

`vercel.json` ships with sensible defaults (build command, output directory, headers for API routes).

`next-sitemap.config.cjs` ships pre-configured to read `NEXT_PUBLIC_SERVER_URL`.

## 21. Repository Hygiene

Files copied/adapted from `payload-test` and cleaned of domain references:

- `.gitignore` — Node, Next.js, Payload, env files, IDE artifacts
- `.gitattributes` — line-ending normalization
- `.editorconfig` — 2 spaces, LF, UTF-8
- `.prettierrc` — match `payload-test` style
- `eslint.config.mjs` — Next + TypeScript
- `tsconfig.json` — strict mode, paths alias `@/*` → `src/*`
- `tailwind.config.mjs` — base config, preflight disabled (per `payload-test` convention to avoid admin conflicts)
- `postcss.config.js`
- `LICENSE` — MIT
- `README.md` — full rewrite, no DATA.BET refs (sections: Quick Start, Configuration, Adding Blocks, Adding Lexical Features, Deployment, Testing)

Repo initialized with `git init`, no history from `payload-test`.

## 22. `.env.example` Structure

```env
# ============================================================
# REQUIRED — must be set for any environment
# ============================================================

# Payload CMS secret. Generate: openssl rand -base64 32
PAYLOAD_SECRET=""

# Database connection. Format depends on starter.config.ts → database.provider:
#   postgres: postgres://user:pass@host:5432/dbname
#   sqlite:   file:./local.db
DATABASE_URL=""

# Public URL of the site (no trailing slash)
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# ============================================================
# STORAGE — required only if storage.provider !== 'local'
# ============================================================

# === S3 (provider='s3') ===
# S3_BUCKET=""
# S3_REGION="us-east-1"
# S3_ACCESS_KEY_ID=""
# S3_SECRET_ACCESS_KEY=""
# S3_ENDPOINT=""                # optional, for R2/MinIO

# === GCS (provider='gcs') ===
# GCS_BUCKET=""
# GOOGLE_APPLICATION_CREDENTIALS="./gcs-key.json"

# === Vercel Blob (provider='vercel-blob') ===
# BLOB_READ_WRITE_TOKEN=""

# ============================================================
# CDN — optional, sets public URL prefix for media
# ============================================================
# NEXT_PUBLIC_CDN_URL=""

# ============================================================
# EMAIL — required only if email.provider !== 'console'
# ============================================================

# === Resend (provider='resend') ===
# RESEND_API_KEY=""

# === SMTP (provider='smtp') ===
# SMTP_HOST=""
# SMTP_PORT="587"
# SMTP_USER=""
# SMTP_PASSWORD=""

# === SendGrid (provider='sendgrid') ===
# SENDGRID_API_KEY=""

# ============================================================
# OPTIONAL
# ============================================================

# Live preview secret (for draft preview from Payload admin)
PREVIEW_SECRET=""

# Node environment
NODE_ENV="development"
```

## 23. README Structure

1. What this is + tech stack
2. Quick Start (clone → `cp .env.example .env` → set 3 required vars → `pnpm install` → `pnpm dev` → `pnpm seed`)
3. Configuration (walk through `starter.config.ts` with examples)
4. The `pnpm starter:sync` command (when to run it)
5. Adding/removing locales (with codemod usage example)
6. Adding a new block (5-step guide)
7. Adding a new Lexical feature (4-step guide referencing `features/highlight/`)
8. Switching DB / storage / email providers (env + config changes)
9. Deployment (Vercel / Railway / Docker)
10. Testing
11. License

## 24. Out of Scope (Explicit Non-Goals)

To prevent scope creep:

- **No GraphQL frontend** — Payload's GraphQL endpoint is enabled by default, but no frontend GraphQL queries shipped (REST `payload.find()` calls used in pages).
- **No tRPC** — not needed for a CMS-driven content site.
- **No custom design system** — Tailwind utilities + base styles only, no shadcn or custom component library beyond what blocks need.
- **No billing/auth providers beyond Payload built-in** — no Clerk, Auth.js, Stripe.
- **No multi-tenancy** — single-tenant Payload installation.
- **No CI/CD pipelines** — `.github/workflows/` not included; user adds per their host.
- **No analytics integrations** — Plausible/Mixpanel/etc. left to user.
- **MongoDB** — not supported; Postgres + SQLite cover the SQL/Drizzle path. Adding Mongo later is a separate spec.

## 25. Success Criteria

The starter ships when, from a clean clone:

1. `pnpm install && cp .env.example .env` (set 3 required vars: `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SERVER_URL`)
2. `pnpm dev` boots without errors on default config (Postgres + local storage + console email + single locale + GSAP off + Swiper on + charts on)
3. `pnpm seed` populates sample content
4. `/admin` login works with seeded user, all 13 blocks selectable in Pages
5. `/`, `/about`, `/contact`, `/blog`, `/blog/<slug>`, `/case-studies`, `/case-studies/<slug>`, `/sitemap.xml` all return 200
6. Changing `starter.config.ts` `i18n.locales` to `['en', 'es']` and running `pnpm starter:sync` adds `localized: true` to qualifying fields and creates a migration
7. Switching `database.provider` to `sqlite` (and updating `DATABASE_URL`) works without code changes
8. Switching `storage.provider` to `s3` (with credentials) works without code changes
9. `pnpm test` passes (unit + e2e smoke)
10. README walks a new dev from zero to running site in under 10 minutes
