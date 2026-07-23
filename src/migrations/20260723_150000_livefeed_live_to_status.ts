/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/**
 * Live-feed `live` (checkbox boolean) replaced by a `status` radio: "live" | "closed".
 * Existing docs are converted (`live === true` → "live", else "closed") and `live` is
 * dropped. Handles both the main collection and the versions collection. Idempotent —
 * docs already carrying `status` are left untouched.
 */

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
      if (!container || container.status != null) continue

      const status = container.live === true ? 'live' : 'closed'
      const prefix = isVersion ? 'version.' : ''
      await col.updateOne(
        { _id: doc._id },
        { $set: { [`${prefix}status`]: status }, $unset: { [`${prefix}live`]: '' } },
        session ? { session } : {},
      )
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
      if (!container || container.status == null) continue

      const live = container.status === 'live'
      const prefix = isVersion ? 'version.' : ''
      await col.updateOne(
        { _id: doc._id },
        { $set: { [`${prefix}live`]: live }, $unset: { [`${prefix}status`]: '' } },
        session ? { session } : {},
      )
    }
  }
}
