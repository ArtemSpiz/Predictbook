/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/**
 * Live-feed timeline updates moved from a plain `text` (textarea) field to a
 * rich-text `body` (Lexical) field. Existing updates are migrated by wrapping
 * their `text` into a minimal Lexical document and dropping `text`. `at` is
 * backfilled (drives the "x minutes ago" label) from the doc's own timestamps.
 *
 * Raw driver access is required: `text` no longer exists in the Payload schema,
 * so the typed local API can't read it. Idempotent — entries that already have
 * `body` are left untouched.
 */

const textNode = (text: string) => ({
  type: 'text',
  version: 1,
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: text ? [textNode(text)] : [],
})

const lexicalFromText = (text: string) => {
  const lines = String(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: (lines.length ? lines : ['']).map(paragraph),
    },
  }
}

const plainFromLexical = (body: any): string => {
  const out: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (typeof node.text === 'string') out.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(body?.root)
  return out.join(' ').trim()
}

/** Resolve the real Mongo collection names from Payload, with sane fallbacks. */
function resolveNames(payload: any): { main: string; versions?: string } {
  const main = payload?.db?.collections?.['live-feed']?.collection?.name ?? 'live-feeds'
  const versions =
    payload?.db?.versions?.['live-feed']?.collection?.name ?? '_live-feed_versions'
  return { main, versions }
}

export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  const conn: any = (payload.db as any).connection
  const { main, versions } = resolveNames(payload)

  for (const name of [main, versions].filter(Boolean) as string[]) {
    const isVersion = name.includes('version')
    const col = conn.collection(name)
    const cursor = col.find({})
    for await (const doc of cursor) {
      const container = isVersion ? doc.version : doc
      const timeline = container?.timeline
      if (!Array.isArray(timeline) || timeline.length === 0) continue

      let changed = false
      const fallbackAt = container?.publishedAt ?? doc.createdAt ?? doc.updatedAt ?? new Date()
      const next = timeline.map((entry: any) => {
        if (entry && entry.body == null && typeof entry.text === 'string') {
          changed = true
          const { text, ...rest } = entry
          return { ...rest, body: lexicalFromText(text), at: entry.at ?? fallbackAt }
        }
        return entry
      })

      if (changed) {
        const path = isVersion ? 'version.timeline' : 'timeline'
        await col.updateOne({ _id: doc._id }, { $set: { [path]: next } }, session ? { session } : {})
      }
    }
  }
}

export async function down({ payload, session }: MigrateDownArgs): Promise<void> {
  const conn: any = (payload.db as any).connection
  const { main, versions } = resolveNames(payload)

  for (const name of [main, versions].filter(Boolean) as string[]) {
    const isVersion = name.includes('version')
    const col = conn.collection(name)
    const cursor = col.find({})
    for await (const doc of cursor) {
      const container = isVersion ? doc.version : doc
      const timeline = container?.timeline
      if (!Array.isArray(timeline) || timeline.length === 0) continue

      let changed = false
      const next = timeline.map((entry: any) => {
        if (entry && entry.body != null && typeof entry.text !== 'string') {
          changed = true
          const { body, heading, image, at, ...rest } = entry
          return { ...rest, text: plainFromLexical(body) }
        }
        return entry
      })

      if (changed) {
        const path = isVersion ? 'version.timeline' : 'timeline'
        await col.updateOne({ _id: doc._id }, { $set: { [path]: next } }, session ? { session } : {})
      }
    }
  }
}
