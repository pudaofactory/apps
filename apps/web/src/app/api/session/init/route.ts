import { NextResponse } from 'next/server'
import { getOrCreateUid } from '@/server/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getOrCreateUid()

  return NextResponse.json({
    ok: true,
    uid: session.uid,
    plan: session.plan,
    credits: session.credits
  })
}
