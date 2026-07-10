/* eslint-disable @typescript-eslint/no-explicit-any */
const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', text }] }],
  },
})

export const sampleNewsPosts: any[] = [
  {
    slug: 'welcome',
    title: 'Welcome to the starter',
    excerpt: 'A quick tour of the included blocks.',
    _status: 'published',
    content: richText('Body of the welcome post.'),
  },
  {
    slug: 'why-payload',
    title: 'Why Payload CMS',
    excerpt: 'Reasons for choosing Payload as the CMS.',
    _status: 'published',
    content: richText('Payload is type-safe, code-first, and self-hostable.'),
  },
  {
    slug: 'starter-config',
    title: 'Configuring the starter',
    excerpt: 'How starter.config.ts works.',
    _status: 'published',
    content: richText('Walk through each section.'),
  },
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
