/* eslint-disable @typescript-eslint/no-explicit-any */
const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', text }] }],
  },
})

export const sampleCaseStudies: any[] = [
  {
    slug: 'acme-corp-redesign',
    title: 'Acme Corp Website Redesign',
    excerpt: 'Rebuilding marketing site on Payload + Next.js.',
    client: 'Acme Corp',
    industry: 'SaaS',
    duration: '3 months',
    services: [{ name: 'Web Design' }, { name: 'CMS Implementation' }, { name: 'Performance' }],
    _status: 'published',
    content: richText('Body of the case study.'),
  },
  {
    slug: 'beta-co-content-platform',
    title: 'Beta Co Content Platform',
    excerpt: 'Editorial workflows and multilingual publishing.',
    client: 'Beta Co',
    industry: 'Media',
    duration: 'Q1 2025',
    services: [{ name: 'Editorial Tooling' }, { name: 'i18n' }],
    _status: 'published',
    content: richText('Body of the case study.'),
  },
]
