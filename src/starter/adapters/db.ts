// import { postgresAdapter } from '@payloadcms/db-postgres'
// import { sqliteAdapter } from '@payloadcms/db-sqlite'
// import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import type { DatabaseConfig } from '../types'

// export function resolveDbAdapter(config: DatabaseConfig) {
//   const url = process.env.DATABASE_URL
//   if (!url) {
//     // Fall back to a local SQLite file so the project boots without any
//     // external database provisioned. Set DATABASE_URL for postgres/remote DB.
//     console.warn(
//       '[db] DATABASE_URL is not set — falling back to local SQLite (file:./local.db). See .env.example.',
//     )
//     return sqliteAdapter({
//       client: { url: 'file:./local.db' },
//       migrationDir: 'src/migrations',
//     })
//   }
//   if (config.provider === 'postgres') {
//     return postgresAdapter({
//       pool: { connectionString: url },
//       migrationDir: 'src/migrations',
//     })
//   }
//   if (config.provider === 'sqlite') {
//     return sqliteAdapter({
//       client: { url },
//       migrationDir: 'src/migrations',
//     })
//   }
//   if (config.provider === 'mongodb') {
//     return mongooseAdapter({
//       url,
//     })
//   }
//   throw new Error(`Unsupported database provider: ${(config as { provider: string }).provider}`)
// }

import type { DatabaseConfig } from '../types'
import { mongoConnectOptions } from '../mongoConnectOptions'

export async function resolveDbAdapter(config: DatabaseConfig) {
  const url = process.env.DATABASE_URL

  if (!url) {
    if (process.env.VERCEL) {
      // На Vercel файлова система read-only і sqlite-fallback тут неможливий —
      // краще впасти одразу з чіткою помилкою, ніж отримати MODULE_NOT_FOUND.
      throw new Error(
        '[db] DATABASE_URL is not set in the Vercel environment. Add it in Project Settings → Environment Variables (Production).',
      )
    }
    console.warn('[db] DATABASE_URL is not set — falling back to local SQLite (file:./local.db).')
    const { sqliteAdapter } = await import('@payloadcms/db-sqlite')
    return sqliteAdapter({
      client: { url: 'file:./local.db' },
      migrationDir: 'src/migrations',
    })
  }

  if (config.provider === 'postgres') {
    const { postgresAdapter } = await import('@payloadcms/db-postgres')
    return postgresAdapter({
      pool: { connectionString: url },
      migrationDir: 'src/migrations',
    })
  }

  if (config.provider === 'sqlite') {
    const { sqliteAdapter } = await import('@payloadcms/db-sqlite')
    return sqliteAdapter({
      client: { url },
      migrationDir: 'src/migrations',
    })
  }

  if (config.provider === 'mongodb') {
    const { mongooseAdapter } = await import('@payloadcms/db-mongodb')
    return mongooseAdapter({ url, connectOptions: mongoConnectOptions() })
  }

  throw new Error(`Unsupported database provider: ${(config as { provider: string }).provider}`)
}
