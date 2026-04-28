/* eslint-disable @typescript-eslint/no-explicit-any */
const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', text }] }],
  },
})

export const samplePages: any[] = [
  {
    slug: 'home',
    title: 'Home',
    _status: 'published',
    blocks: [
      {
        blockType: 'hero',
        heading: 'Build any project, fast.',
        subheading: richText('Payload + Next.js starter with sensible defaults.'),
        ctas: [{ link: { type: 'custom', url: '/about', label: 'Learn more' } }],
      },
      {
        blockType: 'feature-grid',
        heading: 'Everything included',
        columns: '3',
        items: [
          { title: 'Typed config', description: 'One file controls every project-level choice.' },
          {
            title: 'Optional providers',
            description: 'Switch DB, storage, email without touching code.',
          },
          { title: '13 generic blocks', description: 'Ready-to-use building blocks.' },
        ],
      },
    ],
  },
  {
    slug: 'about',
    title: 'About',
    _status: 'published',
    blocks: [
      { blockType: 'hero', heading: 'About this starter' },
      {
        blockType: 'rich-text-block',
        maxWidth: 'prose',
        content: richText('A starter for any Payload + Next.js project.'),
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    _status: 'published',
    blocks: [{ blockType: 'hero', heading: 'Get in touch' }],
  },
]
