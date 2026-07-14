declare namespace NodeJS {
  interface ProcessEnv {
    PAYLOAD_SECRET: string
    DATABASE_URL: string
    NEXT_PUBLIC_SERVER_URL: string
    NEXT_PUBLIC_CDN_URL?: string
    PREVIEW_SECRET?: string
    NODE_ENV: 'development' | 'production' | 'test'

    STORAGE_PROVIDER?: 'local' | 's3' | 'gcs' | 'vercel-blob'
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string
    TURNSTILE_SECRET_KEY?: string
    S3_BUCKET?: string
    S3_REGION?: string
    S3_ACCESS_KEY_ID?: string
    S3_SECRET_ACCESS_KEY?: string
    S3_ENDPOINT?: string
    GCS_BUCKET?: string
    GOOGLE_APPLICATION_CREDENTIALS?: string
    BLOB_READ_WRITE_TOKEN?: string

    SIGNALS_SYNC_ENABLED?: string
    SIGNALS_API_URL?: string
    SIGNALS_SYNC_INTERVAL_MS?: string
    SIGNALS_SYNC_BATCH_LIMIT?: string
    SIGNALS_SYNC_SECRET?: string

    RESEND_API_KEY?: string
    SMTP_HOST?: string
    SMTP_PORT?: string
    SMTP_USER?: string
    SMTP_PASSWORD?: string
    SENDGRID_API_KEY?: string
  }
}
