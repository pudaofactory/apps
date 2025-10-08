import { NextRequest, NextResponse } from 'next/server'
import { verifyClaimToken } from '@/server/claim'
import { prisma } from '@/server/prisma'
import { ensureCredits } from '@/server/credits'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('t')

    if (!token) {
      return NextResponse.redirect(new URL('/en/billing?error=missing_token', req.url))
    }

    // Verify token
    const payload = verifyClaimToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/en/billing?error=invalid_token', req.url))
    }

    const { email, plan } = payload

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email } })
    }

    // Upsert subscription
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan,
        status: 'active',
        provider: 'lemon_squeezy',
      },
      create: {
        userId: user.id,
        plan,
        status: 'active',
        provider: 'lemon_squeezy',
      },
    })

    // Ensure credits
    await ensureCredits(user.id, plan)

    console.log(`[Claim] Successfully claimed ${plan} for ${email}`)

    return NextResponse.redirect(new URL('/en/billing?claimed=1', req.url))
  } catch (error) {
    console.error('[Claim] Error:', error)
    return NextResponse.redirect(new URL('/en/billing?error=claim_failed', req.url))
  }
}
