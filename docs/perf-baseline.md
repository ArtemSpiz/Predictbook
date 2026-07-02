# Performance baseline (Lighthouse)

Track Core Web Vitals and Lighthouse category scores over time so regressions
are visible.

## Running

```bash
# Terminal 1 — production build + server (dev mode scores are not representative)
pnpm build && pnpm start

# Terminal 2 — run the audits
pnpm lighthouse
```

Configure targets via env:

- `BASE_URL` — server to audit (default `http://localhost:3000`)
- `LH_PATHS` — comma-separated paths (default `/,/blog,/case-studies`)

Requires a local Chrome/Chromium; audits run mobile form-factor.

## Baseline

Record results here after each significant change (paste the printed table):

| Date | Path | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|------|----|-----|-----|-----|-----|
| _TBD_ | / | | | | | | | |

## Notes

- Always compare production builds; `pnpm dev` includes unminified bundles and
  dev-only overhead.
- Empty database (no content/images) inflates some scores — seed representative
  content before treating numbers as a real baseline.
