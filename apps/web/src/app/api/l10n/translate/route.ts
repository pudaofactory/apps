import { NextResponse } from 'next/server'
import { getOrCreateUid } from '@/server/session'
import { consumeCredit, InsufficientCreditsError } from '@/server/usage'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await getOrCreateUid()

  try {
    const { credits, usage } = await consumeCredit(session.uid, 'l10n', 5)

    const rows = [
      {
        id: 'row_1',
        source: 'Hello world',
        target: 'Ni hao, shi jie',
        context: 'generic'
      },
      {
        id: 'row_2',
        source: 'Start recording',
        target: 'Kai shi lu zhi',
        context: 'button'
      },
      {
        id: 'row_3',
        source: 'Stop recording',
        target: 'Ting zhi lu zhi',
        context: 'button'
      },
      {
        id: 'row_4',
        source: 'Export summary',
        target: 'Dao chu zhai yao',
        context: 'menu'
      },
      {
        id: 'row_5',
        source: 'Upgrade to Pro',
        target: 'Sheng ji dao Pro',
        context: 'banner'
      }
    ]

    return NextResponse.json({
      ok: true,
      plan: session.plan,
      credits: {
        clip: credits.clip,
        l10n: credits.l10n
      },
      usageId: usage.id,
      translations: rows
    })
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { ok: false, error: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      )
    }

    console.error('[l10n.translate] error', error)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
