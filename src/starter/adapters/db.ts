import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import type { DatabaseConfig } from '../types'

export function resolveDbAdapter(config: DatabaseConfig) {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required. See .env.example.')
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
