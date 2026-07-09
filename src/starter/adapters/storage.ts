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
    // When a public CDN URL is set (Cloudflare R2 public bucket / custom domain),
    // serve media straight from the CDN instead of proxying every request through
    // the Node server — essential for a high-traffic, photo-heavy site.
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '')
    return s3Storage({
      collections: {
        media: cdnUrl
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${cdnUrl}/${prefix ? `${prefix}/` : ''}${filename}`,
            }
          : true,
      },
      bucket: requireEnv('S3_BUCKET'),
      config: {
        // R2 always uses region 'auto'; real AWS S3 sets S3_REGION explicitly.
        region: process.env.S3_REGION || 'auto',
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
