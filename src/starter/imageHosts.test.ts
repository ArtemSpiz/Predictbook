import { describe, it, expect } from 'vitest'
import { buildImageRemotePatterns } from './imageHosts.mjs'

describe('buildImageRemotePatterns', () => {
  it('always allows localhost for dev', () => {
    const patterns = buildImageRemotePatterns({})
    expect(patterns).toEqual(
      expect.arrayContaining([
        { protocol: 'http', hostname: 'localhost' },
        { protocol: 'http', hostname: '127.0.0.1' },
      ]),
    )
  })

  it('derives hosts from CDN and server URLs', () => {
    const patterns = buildImageRemotePatterns({
      NEXT_PUBLIC_CDN_URL: 'https://cdn.example.com',
      NEXT_PUBLIC_SERVER_URL: 'https://predictbook.example.com',
    })
    expect(patterns).toEqual(
      expect.arrayContaining([
        { protocol: 'https', hostname: 'cdn.example.com' },
        { protocol: 'https', hostname: 'predictbook.example.com' },
      ]),
    )
  })

  it('parses NEXT_PUBLIC_IMAGE_HOSTS (bare hosts and full URLs), de-duped', () => {
    const patterns = buildImageRemotePatterns({
      NEXT_PUBLIC_CDN_URL: 'https://cdn.example.com',
      NEXT_PUBLIC_IMAGE_HOSTS: 'cdn.example.com, bucket.r2.dev, https://logos.example.com',
    })
    const https = patterns.filter((p) => p.protocol === 'https').map((p) => p.hostname)
    expect(https).toContain('cdn.example.com')
    expect(https).toContain('bucket.r2.dev')
    expect(https).toContain('logos.example.com')
    expect(https.filter((h) => h === 'cdn.example.com')).toHaveLength(1)
  })

  it('ignores malformed URLs without throwing', () => {
    expect(() => buildImageRemotePatterns({ NEXT_PUBLIC_CDN_URL: 'not a url' })).not.toThrow()
  })

  it('ignores non-http(s) protocols', () => {
    const patterns = buildImageRemotePatterns({ NEXT_PUBLIC_CDN_URL: 'ftp://cdn.example.com' })
    expect(patterns.some((p) => p.hostname === 'cdn.example.com')).toBe(false)
  })
})
