import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import type { DatabaseConfig } from '../types'

export function resolveDbAdapter(config: DatabaseConfig) {
  const url = process.env.DATABASE_URL
  if (!url) {
    // Fall back to a local SQLite file so the project boots without any
    // external database provisioned. Set DATABASE_URL for postgres/remote DB.
    console.warn(
      '[db] DATABASE_URL is not set — falling back to local SQLite (file:./local.db). See .env.example.',
    )
    return sqliteAdapter({
      client: { url: 'file:./local.db' },
      migrationDir: 'src/migrations',
    })
  }
  if (config.provider === 'postgres') {
    return postgresAdapter({
      pool: { connectionString: url },
      migrationDir: 'src/migrations',
    })
  }
  if (config.provider === 'sqlite') {
    return sqliteAdapter({
      client: { url },
      migrationDir: 'src/migrations',
    })
  }
  throw new Error(`Unsupported database provider: ${(config as { provider: string }).provider}`)
}
