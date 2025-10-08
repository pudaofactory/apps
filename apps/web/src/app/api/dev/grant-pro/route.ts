import { NextRequest } from 'next/server'
import { prisma } from '@/server/prisma'
import { ensureCredits } from '@/server/credits'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  const email = req.nextUrl.searchParams.get('email')

  if (!email) {
    return Response.json({ error: 'Missing email parameter' }, { status: 400 })
  }

  try {
    // Upsert user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email } })
    }

    // Upsert subscription to PRO
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: 'PRO',
        status: 'active',
        provider: 'lemon_squeezy',
      },
      create: {
        userId: user.id,
        plan: 'PRO',
        status: 'active',
        provider: 'lemon_squeezy',
      },
    })

    // Ensure credits
    await ensureCredits(user.id, 'PRO')

    console.log(`[DEV] Granted PRO to ${email}`)

    return Response.json({ ok: true, email, plan: 'PRO' })
  } catch (error) {
    console.error('[DEV] Error granting PRO:', error)
    return Response.json({ error: 'Failed to grant PRO' }, { status: 500 })
  }
}
