# Newsletter → Substack embed & Contact form mailbox routing

Date: 2026-07-21

Two independent improvements to the public-facing forms on predictbook.co.

## Feature 1 — Newsletter CTA: real subscribe via Substack embed

### Problem
`AboutCTA.tsx` collects emails into the `newsletter-submissions` CMS collection but
never enrols anyone into the actual Substack (`predictbook.substack.com`). Emails
accumulate; no newsletter is ever sent. The CTA is functionally a dead end.

### Solution
Replace the custom email form with Substack's official iframe embed
(`https://predictbook.substack.com/embed`). Substack owns validation, double
opt-in, and captcha, so a subscribe becomes real.

- **Keep** the branded dark `bg-ink` wrapper and the CMS-editable `cta.heading` /
  `cta.text`. Only the input + button + Turnstile are replaced by the iframe.
- The embed URL is a new optional CMS field `cta.embedUrl`, defaulting to
  `https://predictbook.substack.com/embed`, so it stays editable and `AboutCTA`
  (used on the About page *and* on news article pages, the latter with no props)
  has a sensible fallback.
- **Drop** the on-site signup record for new subscribers; Substack becomes the
  source of truth.

### Orphaned pieces
- `src/app/hooks/useNewsletterForm.ts` — delete (dead code).
- `src/app/api/newsletter/route.ts` — delete (dead code).
- `NewsletterSubmissions` collection — **keep** to preserve historical signup data.

### Trade-off accepted
The Substack embed is a fixed white widget with Substack's own styling; it will
not perfectly match the dark CTA. Inherent to the embed approach.

## Feature 2 — Contact form: route inquiries to branded mailboxes

### Problem
`/api/contact` saves submissions to the `contact-submissions` CMS collection only.
No email is delivered to a mailbox, and there is no per-subject routing.

### Solution — CMS-driven mapping
Extend the `contact-form-fields` block:
- add optional `routeTo` (email) to each `subjectOptions` item;
- add optional `defaultRecipient` (email) on the block.

Editor configures e.g. `Advertising → advertising@predictbook.co`,
`General inquiry → info@predictbook.co`; options without `routeTo` fall back to
`defaultRecipient`.

### Server (`/api/contact`)
After the existing CMS create (unchanged), the route:
1. reads the `ContactPage` global, finds the `contact-form-fields` block;
2. finds the option whose `label` equals the submitted `subject`;
3. resolves recipient = `option.routeTo` → `block.defaultRecipient` →
   `process.env.CONTACT_INBOX` → configured `from` address;
4. calls `payload.sendEmail({ to, from, replyTo: submitterEmail, subject, html })`.

### Trust & resilience
- Recipient is resolved **server-side from the CMS**, never from the client —
  cannot be spoofed to relay mail to an arbitrary address.
- The send is wrapped in try/catch: a failure is logged but the route still
  returns success, because the submission is already persisted in CMS.

### Deferred go-live
Email adapter stays `provider: 'console'` (current default). Sends are logged to
the server console and the whole flow is testable now. Going live requires only
verifying the sending domain and setting `provider` + credentials +
`CONTACT_INBOX` in env — no code change.

## Out of scope
- Opening the `advertising@` / `info@` mailboxes and DNS (MX/SPF/DKIM/DMARC) —
  infrastructure task owned by the team.
- Choosing the transactional sender (Resend vs. mailbox SMTP) — decided later;
  the code is provider-agnostic behind the existing adapter.
