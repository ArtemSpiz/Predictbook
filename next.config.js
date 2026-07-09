import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      // Local dev: Payload serves media with an absolute URL derived from
      // NEXT_PUBLIC_SERVER_URL (http://localhost:3000).
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'swiper', 'recharts'],
  },
  // Pin the workspace root so Next 16 doesn't infer a parent dir when multiple
  // lockfiles are present.
  turbopack: {
    root: dirname,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
