import { NextResponse } from 'next/server'
import { getOrCreateUid } from '@/server/session'
import { consumeCredit, InsufficientCreditsError } from '@/server/usage'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await getOrCreateUid()

  try {
    const { credits, usage } = await consumeCredit(session.uid, 'clip', 1)

    const clips = [
      {
        id: 'clip_intro',
        title: 'Intro Highlight',
        startSeconds: 0,
        endSeconds: 45,
        confidence: 0.92
      },
      {
        id: 'clip_mid',
        title: 'Core Demo',
        startSeconds: 120,
        endSeconds: 210,
        confidence: 0.87
      },
      {
        id: 'clip_outro',
        title: 'Call To Action',
        startSeconds: 360,
        endSeconds: 420,
        confidence: 0.9
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
      clips
    })
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { ok: false, error: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      )
    }

    console.error('[clip.analyze] error', error)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
