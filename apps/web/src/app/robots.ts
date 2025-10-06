import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === 'preview'

  if (isPreview) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }]
    }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }]
  }
}


