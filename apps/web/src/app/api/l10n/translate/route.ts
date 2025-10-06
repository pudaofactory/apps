import { NextRequest, NextResponse } from 'next/server'
import { L10nTranslateIn, L10nTranslateOut } from '@sdk/schemas'
import { callLLM } from '@/lib/llm'
import { getUserId } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = L10nTranslateIn.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 })
  }

  const uid = getUserId()

  const result = await callLLM('l10n-translate', {
    ...parsed.data,
    uid
  })

  const validated = L10nTranslateOut.safeParse(result)

  if (!validated.success) {
    return NextResponse.json({ error: 'invalid llm response' }, { status: 502 })
  }

  return NextResponse.json(validated.data)
}
