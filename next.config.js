import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'
import { buildImageRemotePatterns } from './src/starter/imageHosts.mjs'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: buildImageRemotePatterns(),
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'swiper', 'recharts'],
  },
  // Pin the workspace root so Next 16 doesn't infer a parent dir when multiple
  // lockfiles are present.
  turbopack: {
    root: dirname,
  },
  // Legacy URL scheme; specific rules must precede the /news/:path* catch-all.
  async redirects() {
    return [
      { source: '/news/category/:category', destination: '/analysis/:category', permanent: true },
      { source: '/news/tag/:slug', destination: '/analysis/tag/:slug', permanent: true },
      { source: '/news', destination: '/analysis', permanent: true },
      { source: '/news/:path*', destination: '/analysis/:path*', permanent: true },
      { source: '/live-feed', destination: '/live', permanent: true },
      { source: '/live-feed/:path*', destination: '/live/:path*', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
