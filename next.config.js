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
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
