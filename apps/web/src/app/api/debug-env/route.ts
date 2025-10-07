export const dynamic = 'force-dynamic'

export async function GET() {
  // Only allow in non-production
  if (process.env.VERCEL_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  return Response.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_DATABASE_URL,
    vercelEnv: process.env.VERCEL_ENV,
    nodeEnv: process.env.NODE_ENV,
    // Show first 20 chars of DB URL for debugging (if exists)
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'NOT_SET'
  })
}
