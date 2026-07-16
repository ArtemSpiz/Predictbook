#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Backfill the Authors collection from the author data embedded on News posts
 * (author → users, "author photo", "author job") and link each post's
 * authorProfile. Idempotent: authors are upserted by slug and posts are only
 * updated when authorProfile is not already set. Safe to run against prod:
 *
 *   pnpm dlx tsx --env-file=.env scripts/migrate-authors.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Posts whose author relationship points to a since-deleted user are attributed
// to this byline (confirmed with the site owner).
const FALLBACK_AUTHOR = 'Toghrul Aliyev'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const idOf = (v: any): string | undefined =>
  v && typeof v === 'object' ? v.id : typeof v === 'string' || typeof v === 'number' ? String(v) : undefined

async function main() {
  const payload = await getPayload({ config })

  // Collect every News post (paginated).
  const posts: any[] = []
  for (let page = 1; ; page++) {
    const { docs, totalPages } = await payload.find({
      collection: 'news',
      depth: 1,
      page,
      limit: 100,
      overrideAccess: true,
    })
    posts.push(...docs)
    if (page >= totalPages) break
  }

  // Resolve a News.author value (populated user object or raw id) to a name.
  const userNameById = new Map<string, string | undefined>()
  const resolveUserName = async (author: any): Promise<string | undefined> => {
    if (!author) return undefined
    if (typeof author === 'object') return author.name
    const id = String(author)
    if (userNameById.has(id)) return userNameById.get(id)
    let name: string | undefined
    try {
      const u = await payload.findByID({ collection: 'users', id, overrideAccess: true })
      name = (u as any)?.name
    } catch {
      name = undefined
    }
    userNameById.set(id, name)
    return name
  }

  // slug -> author id (created/looked up on demand).
  const authorIdBySlug = new Map<string, string>()

  const ensureAuthor = async (name: string, photoId?: string, role?: string) => {
    const slug = slugify(name)
    if (!slug) return undefined
    if (authorIdBySlug.has(slug)) return authorIdBySlug.get(slug)

    const found = await payload.find({
      collection: 'authors',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    let id: string
    if (found.docs[0]) {
      id = found.docs[0].id
    } else {
      const created = await payload.create({
        collection: 'authors',
        data: { name, slug, ...(photoId ? { photo: photoId } : {}), ...(role ? { role } : {}) },
        overrideAccess: true,
      })
      id = created.id
      console.log(`  + author: ${name} (/author/${slug})`)
    }
    authorIdBySlug.set(slug, id)
    return id
  }

  let linked = 0
  for (const post of posts) {
    if (post.authorProfile) continue // already linked
    if (!post.author) continue // no author set — nothing to attribute
    const name = (await resolveUserName(post.author)) ?? FALLBACK_AUTHOR

    const authorId = await ensureAuthor(name, idOf(post['author photo']), post['author job'] || undefined)
    if (!authorId) continue

    await payload.update({
      collection: 'news',
      id: post.id,
      data: { authorProfile: authorId },
      overrideAccess: true,
    })
    linked++
  }

  console.log(`[migrate-authors] authors: ${authorIdBySlug.size}, posts linked: ${linked}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
