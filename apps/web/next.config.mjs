/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@repo/ui', '@repo/sdk']
}

export default nextConfig
