import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateUid } from '@/server/session'
import { consumeCredit, InsufficientCreditsError } from '@/server/usage'

export const dynamic = 'force-dynamic'

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product')
  const unitsRaw = req.nextUrl.searchParams.get('n')

  if (product !== 'clip' && product !== 'l10n') {
    return badRequest('INVALID_PRODUCT')
  }

  const units = unitsRaw ? Number.parseInt(unitsRaw, 10) : 1
  if (!Number.isFinite(units) || units <= 0) {
    return badRequest('INVALID_UNITS')
  }

  const session = await getOrCreateUid()

  try {
    const { credits, usage } = await consumeCredit(session.uid, product, units)
    return NextResponse.json({
      ok: true,
      plan: session.plan,
      credits: {
        clip: credits.clip,
        l10n: credits.l10n
      },
      usageId: usage.id
    })
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { ok: false, error: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      )
    }

    console.error('[usage.consume] error', error)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
