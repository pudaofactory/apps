import { NextRequest, NextResponse } from 'next/server'
import { ClipAnalyzeIn, ClipAnalyzeOut } from '@sdk/schemas'
import { callLLM } from '@/lib/llm'
import { getUserId } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)

  const parsed = ClipAnalyzeIn.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 })
  }

  const uid = getUserId()

  const result = await callLLM('clip-analyze', {
    ...parsed.data,
    uid
  })

  const validated = ClipAnalyzeOut.safeParse(result)

  if (!validated.success) {
    return NextResponse.json({ error: 'invalid llm response' }, { status: 502 })
  }

  return NextResponse.json(validated.data)
}
