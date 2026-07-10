# Payload Starter

A domain-agnostic boilerplate for **Payload CMS 3.x + Next.js 15** projects. Configurable via a single typed `starter.config.ts` — switch databases, storage, email providers, and toggle features without touching code.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **CMS:** Payload CMS 3.x
- **Database:** PostgreSQL or SQLite (Drizzle adapters)
- **Storage:** Local filesystem, S3, GCS, or Vercel Blob
- **Email:** Console, Resend, SMTP, or SendGrid
- **Editor:** Lexical (`defaultLexical` + `wideMarkupLexical` presets)
- **Styling:** Tailwind CSS (preflight disabled to coexist with Payload admin)
- **Charts:** Recharts (toggleable)
- **Carousels:** Swiper (toggleable)
- **Tests:** Vitest + Playwright

## Quick Start

```bash
git clone <your-fork-url> my-project
cd my-project
cp .env.example .env
# Set the 3 required vars: PAYLOAD_SECRET, DATABASE_URL, NEXT_PUBLIC_SERVER_URL
pnpm install
pnpm dev
```

Visit:

- `http://localhost:3000` — public site
- `http://localhost:3000/admin` — Payload admin (creates first user on first visit)

After admin is created:

```bash
pnpm seed       # populate sample pages, news posts
```

Generate a `PAYLOAD_SECRET`:

```bash
openssl rand -base64 32
```

## Configuration — `starter.config.ts`

Single typed file at the repo root controls every project-level choice:

```ts
import { defineStarterConfig } from './src/starter/define'

export default defineStarterConfig({
  database: { provider: 'postgres' }, // 'postgres' | 'sqlite'
  storage: { provider: 'local' }, // 'local' | 's3' | 'gcs' | 'vercel-blob'
  cdn: { url: process.env.NEXT_PUBLIC_CDN_URL },
  email: { provider: 'console', from: 'noreply@example.com' },

  i18n: {
    locales: ['en'], // length === 1 → single-locale mode
    defaultLocale: 'en',
    skipFields: [], // overrides for codemod
    forceFields: [],
    skipCollections: [],
  },

  features: {
    gsap: false, // animation library
    swiper: true, // carousels (LogoCloud, Testimonials)
    charts: true, // Recharts (StatsChart block)
    livePreview: true, // Payload draft live-preview
    seo: true, // @payloadcms/plugin-seo
    redirects: true, // @payloadcms/plugin-redirects
    search: true, // @payloadcms/plugin-search
    formBuilder: true, // @payloadcms/plugin-form-builder
    nestedDocs: true, // @payloadcms/plugin-nested-docs
    importExport: true, // @payloadcms/plugin-import-export
    auditLog: false,
  },

  collections: {
    news: true,
    categories: true,
    tags: true,
  },
})
```

Each toggle either omits the corresponding plugin/block from the build, or wires in a different adapter. Sensitive values (DB URL, secrets) live in `.env`; the config file decides _what is enabled_.

## `pnpm starter:sync`

Run after editing `starter.config.ts` to regenerate types and apply codemods:

```bash
pnpm starter:sync
```

What it does:

1. **i18n codemod** — if `i18n.locales.length > 1`, walks each collection's field tree and adds `localized: true` to text/textarea/richText/select fields not in the built-in denylist (`slug`, `email`, `url`, `phone`, `_status`, `role`, `password`, `id`, `key`, `code`, `provider`, `iconName`, `staticURL`) or marked `unique: true`. Respects `i18n.skipFields`, `forceFields`, `skipCollections` overrides.
2. **Type regeneration** — `pnpm generate:types` refreshes `src/payload-types.ts`.
3. **Migration** — `pnpm migrate:create --name=starter-sync-<timestamp>` produces a SQL migration. Inspect it before running `pnpm migrate`.

To remove `localized: true` (when shrinking from multi to single locale, destructive):

```bash
pnpm starter:sync -- --confirm-locale-shrink
```

## Adding/Removing Locales

```ts
// starter.config.ts
i18n: { locales: ['en', 'es', 'pt'], defaultLocale: 'en', ... }
```

```bash
pnpm starter:sync
pnpm migrate
```

Single-locale (default) hides the language switcher and skips the `localized` field annotation entirely. Multi-locale enables Payload's `localization` config, registers the `Translations` global, and renders the cookie-based switcher in the header.

## Adding a New Block

1. Create `src/blocks/MyBlock/`:
   - `config.ts` — Payload `Block` definition (with `slug`, `imageURL: '/blocks/my-block.png'`, `imageAltText`, `admin.group`).
   - `Component.tsx` — React server component (or pair with `Component.client.tsx` if you need state/interaction).
2. Register in `src/blocks/RenderBlocks.tsx` `components` map.
3. Add to `src/collections/Pages/index.ts` `allBlocks` array.
4. Drop a placeholder PNG into `public/blocks/my-block.png` (run `pnpm tsx scripts/gen-block-placeholders.ts` after adding the slug to the array there for a quick stub).
5. `pnpm starter:sync` to regenerate types and migrations.

Use `Hero` (`src/blocks/Hero/`) as the canonical reference. All 13 included blocks follow the same shape.

## Adding a New Lexical Feature

The `Highlight` feature at `src/features/highlight/` is the reference. To add your own:

1. Copy `src/features/highlight/` to `src/features/<your-feature>/`.
2. Update `feature.server.ts` (server-side definition + node references) and `feature.client.tsx` (toolbar button + onSelect handler).
3. Update or create node files in `components/`.
4. Import in `src/fields/wideMarkupLexical.ts` and add to the features list. Optionally add to `src/fields/defaultLexical.ts` if appropriate for short content.

## Switching Providers

### Database

```ts
database: {
  provider: 'sqlite'
}
```

```env
DATABASE_URL="file:./local.db"
```

```bash
pnpm starter:sync
pnpm migrate
```

### Storage

```ts
storage: {
  provider: 's3'
} // or 'gcs' | 'vercel-blob' | 'local'
```

```env
S3_BUCKET="..."
S3_REGION="..."
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
# S3_ENDPOINT="..."   # optional, for R2 / MinIO
```

R2 uses the S3 adapter — set `S3_ENDPOINT` to your R2 endpoint URL.

### Email

```ts
email: { provider: 'resend', from: 'hello@your-domain.com' }
```

```env
RESEND_API_KEY="re_..."
```

`console` is the default and safest in dev — it logs payloads to the terminal so contact-form posts don't fail without credentials.

## Deployment

### Vercel

1. Connect the repo. Vercel reads `vercel.json` (build command: `pnpm build`).
2. Add a Postgres database (Vercel Postgres or Neon).
3. Add a Vercel Blob store. Set `storage.provider: 'vercel-blob'` in `starter.config.ts`.
4. Set env vars in the dashboard: `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN`, optional `RESEND_API_KEY`.
5. Deploy. After first deploy, run migrations (Vercel runs `postbuild`/sitemap automatically; migrations need a separate step — see `pnpm migrate`).

### Railway

1. Add a Postgres service. Copy the connection string into `DATABASE_URL`.
2. Storage: use Railway's volume + `local` for small projects, or attach an S3-compatible bucket.
3. Push — Railway uses the included `Dockerfile`.

### Self-hosted Docker

```bash
docker compose up           # postgres + app
# OR
docker compose -f docker-compose.sqlite.yml up   # SQLite-only
```

`docker-compose.yml` runs Postgres 16 + the Next.js app side-by-side. `docker-compose.sqlite.yml` is the same minus the database service (file-mounted SQLite).

## Testing

```bash
pnpm test:unit               # vitest — adapters, codemod, slug, etc.
pnpm test:e2e                # playwright — admin login, frontend, sitemap
pnpm test                    # both
```

E2E tests require a running database; `pnpm dev` is auto-started by Playwright.

## Project Structure

```
starter.config.ts            # Source of truth for project-level choices
src/
├── starter/                 # Config types + adapter resolvers
├── collections/             # Users, Media, Pages, News, Categories, Tags
├── globals/                 # Header, Footer, (Translations when multi-locale)
├── blocks/                  # 13 generic blocks + RenderBlocks
├── fields/                  # defaultLexical, wideMarkupLexical, slug, link
├── features/                # Custom Lexical features (highlight example)
├── i18n/                    # Locale config + JSON fallback
├── utilities/               # SEO, getPageBySlug, getNewsPosts, getTranslations
├── access/                  # isAdmin, isAdminOrEditor
├── components/              # Header, Footer, LanguageSwitcher
├── app/(frontend)/          # Public site routes
├── app/(payload)/           # Payload admin + REST/GraphQL
└── payload.config.ts        # Wires starter.config.ts → Payload
scripts/
├── starter-sync.ts          # codemod + types + migration
├── codemods/i18n.ts         # AST manipulation for localized: true
├── seed.ts                  # pnpm seed
├── seed-data/               # sample content
└── gen-block-placeholders.ts
```

## License

MIT
