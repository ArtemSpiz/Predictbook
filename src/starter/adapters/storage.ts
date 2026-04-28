import { s3Storage } from '@payloadcms/storage-s3'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { StorageConfig } from '../types'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required when storage.provider !== 'local'`)
  return value
}

export function resolveStorageAdapter(config: StorageConfig) {
  if (config.provider === 'local') return null

  if (config.provider === 's3') {
    return s3Storage({
      collections: { media: true },
      bucket: requireEnv('S3_BUCKET'),
      config: {
        region: requireEnv('S3_REGION'),
        credentials: {
          accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
          secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
        },
        endpoint: process.env.S3_ENDPOINT,
      },
    })
  }

  if (config.provider === 'gcs') {
    return gcsStorage({
      collections: { media: true },
      bucket: requireEnv('GCS_BUCKET'),
      options: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
    })
  }

  if (config.provider === 'vercel-blob') {
    return vercelBlobStorage({
      collections: { media: true },
      token: requireEnv('BLOB_READ_WRITE_TOKEN'),
    })
  }

  throw new Error(`Unsupported storage provider: ${(config as { provider: string }).provider}`)
}
