/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@repo/ui', '@repo/sdk'],
  // Expose environment variables to the runtime
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL
  },
  headers: async () => {
    const isPreview = process.env.VERCEL_ENV === 'preview'
    if (!isPreview) return []
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }
        ]
      }
    ]
  }
}

export default nextConfig
