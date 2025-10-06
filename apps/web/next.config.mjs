/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@repo/ui', '@repo/sdk']
  ,headers: async () => {
    const isPreview = process.env.VERCEL_ENV === 'preview'
    return [
      {
        source: '/:path*',
        headers: isPreview
          ? [
              { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }
            ]
          : []
      }
    ]
  }
}

export default nextConfig
