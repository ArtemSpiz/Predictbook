#!/usr/bin/env tsx
/* Adds one tag and one published page so every collection has at least one doc.
   Idempotent: upserts by slug. */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function upsert(payload: any, collection: string, slug: string, data: any) {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (found.docs[0]) {
    return payload.update({ collection, id: found.docs[0].id, data, overrideAccess: true })
  }
  return payload.create({ collection, data, overrideAccess: true })
}

const run = async () => {
  const payload = await getPayload({ config })

  await upsert(payload, 'tags', 'markets', { title: 'Markets', slug: 'markets' })
  console.log('✓ tag: Markets')

  await upsert(payload, 'pages', 'about-predictbook', {
    title: 'About Predictbook',
    slug: 'about-predictbook',
    _status: 'published',
  })
  console.log('✓ page: About Predictbook (published)')

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
