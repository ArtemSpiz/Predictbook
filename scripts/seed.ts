#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import starterConfig from '../starter.config'
import { samplePages } from './seed-data/pages'
import { sampleBlogPosts, sampleCategories, sampleTags } from './seed-data/blog'

const RESET = process.argv.includes('--reset')

async function ensureAdmin(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (process.env.NODE_ENV === 'production') return
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@example.com' } },
    limit: 1,
  })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin1234',
        name: 'Admin',
        role: 'admin',
      } as any,
    })
    console.log(' ✓ admin user (admin@example.com / admin1234)')
  }
}

async function clear<T extends 'pages' | 'blog' | 'categories' | 'tags'>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: T,
) {
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
    await clear(payload, 'pages')
  }

  await ensureAdmin(payload)

  console.log('[seed] pages...')
  for (const p of samplePages) {
    await payload.create({ collection: 'pages', data: p })
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
    for (const post of sampleBlogPosts)
      await payload.create({ collection: 'blog', data: post })
  }

  console.log('\n[seed] done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
