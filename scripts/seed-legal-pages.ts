#!/usr/bin/env tsx
/* Seeds boilerplate Privacy Policy and Terms of Service pages (published,
   rendered by the CMS [slug] route; footer already links to these slugs).
   Idempotent: upserts by slug — re-running overwrites the template content.
   Usage: tsx --env-file=.env scripts/seed-legal-pages.ts */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const text = (t: string) => ({ type: 'text', version: 1, text: t })

const node = (type: string, children: any[], extra: Record<string, any> = {}) => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

const h = (tag: 'h1' | 'h2', t: string) => node('heading', [text(t)], { tag })
const p = (t: string) => node('paragraph', [text(t)])
const ul = (items: string[]) =>
  node(
    'list',
    items.map((t, i) => node('listitem', [text(t)], { value: i + 1 })),
    { listType: 'bullet', tag: 'ul', start: 1 },
  )

const richText = (...children: any[]) => ({
  root: node('root', children),
})

const LAST_UPDATED = 'July 15, 2026'
const CONTACT_EMAIL = 'contact@predictbook.co'

const privacyContent = richText(
  h('h1', 'Privacy Policy'),
  p(`Last updated: ${LAST_UPDATED}`),
  p(
    'This Privacy Policy describes how Predictbook ("we", "us", or "our") collects, uses, and protects your information when you visit predictbook.co (the "Site").',
  ),
  h('h2', 'Information We Collect'),
  ul([
    'Usage data: pages visited, time on site, referring pages, and similar analytics data.',
    'Device data: browser type, operating system, and screen size.',
    'Contact data: information you voluntarily submit through our contact form, such as your name and email address.',
  ]),
  h('h2', 'How We Use Your Information'),
  ul([
    'To operate, maintain, and improve the Site.',
    'To respond to your inquiries and messages.',
    'To analyze site usage and improve our content.',
  ]),
  h('h2', 'Cookies'),
  p(
    'We use cookies and similar technologies for essential site functionality and analytics. You can control cookies through your browser settings; disabling them may affect parts of the Site.',
  ),
  h('h2', 'Third-Party Services'),
  p(
    'We may use third-party analytics and infrastructure providers that process data on our behalf. These providers have their own privacy policies, and we encourage you to review them.',
  ),
  h('h2', 'Data Retention'),
  p(
    'We retain personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.',
  ),
  h('h2', 'Your Rights'),
  p(
    'Depending on your jurisdiction, you may have the right to access, correct, or delete personal information we hold about you. To exercise these rights, contact us at the address below.',
  ),
  h('h2', 'Changes to This Policy'),
  p(
    'We may update this Privacy Policy from time to time. Changes take effect when posted on this page, with the "Last updated" date revised accordingly.',
  ),
  h('h2', 'Contact Us'),
  p(`If you have questions about this Privacy Policy, contact us at ${CONTACT_EMAIL}.`),
)

const termsContent = richText(
  h('h1', 'Terms of Service'),
  p(`Last updated: ${LAST_UPDATED}`),
  p(
    'These Terms of Service ("Terms") govern your use of predictbook.co (the "Site") operated by Predictbook. By accessing or using the Site, you agree to be bound by these Terms.',
  ),
  h('h2', 'Description of Service'),
  p(
    'Predictbook provides news, analysis, and informational signals related to prediction markets. All content is provided for informational purposes only.',
  ),
  h('h2', 'No Financial Advice'),
  p(
    'Nothing on the Site constitutes financial, investment, legal, or tax advice. Prediction market activity involves risk. You are solely responsible for your own decisions, and you should consult a qualified professional before acting on any information found on the Site.',
  ),
  h('h2', 'Acceptable Use'),
  ul([
    'Do not use the Site in any way that violates applicable laws or regulations.',
    'Do not attempt to interfere with the proper functioning of the Site.',
    'Do not scrape, reproduce, or redistribute Site content at scale without our prior written permission.',
  ]),
  h('h2', 'Intellectual Property'),
  p(
    'The Site and its original content, features, and functionality are owned by Predictbook and are protected by applicable copyright, trademark, and other intellectual property laws.',
  ),
  h('h2', 'Third-Party Links and Data'),
  p(
    'The Site may reference or link to third-party platforms and display market data sourced from third parties. We are not responsible for the content, accuracy, or availability of third-party services.',
  ),
  h('h2', 'Disclaimer of Warranties'),
  p(
    'The Site is provided "as is" and "as available" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose.',
  ),
  h('h2', 'Limitation of Liability'),
  p(
    'To the maximum extent permitted by law, Predictbook shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Site.',
  ),
  h('h2', 'Changes to These Terms'),
  p(
    'We may revise these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.',
  ),
  h('h2', 'Contact Us'),
  p(`If you have questions about these Terms, contact us at ${CONTACT_EMAIL}.`),
)

const pages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: privacyContent,
    description: 'How Predictbook collects, uses, and protects your information.',
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: termsContent,
    description: 'The terms governing your use of Predictbook.',
  },
]

async function upsert(payload: any, slug: string, data: any) {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (found.docs[0]) {
    return payload.update({ collection: 'pages', id: found.docs[0].id, data, overrideAccess: true })
  }
  return payload.create({ collection: 'pages', data, overrideAccess: true })
}

const run = async () => {
  const payload = await getPayload({ config })

  for (const page of pages) {
    await upsert(payload, page.slug, {
      title: page.title,
      slug: page.slug,
      _status: 'published',
      blocks: [{ blockType: 'rich-text-block', content: page.content, maxWidth: 'prose' }],
      meta: { title: page.title, description: page.description },
    })
    console.log(`✓ page: ${page.title} (published at /${page.slug})`)
  }

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
