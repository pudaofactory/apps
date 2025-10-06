import type { TClipAnalyzeIn, TClipAnalyzeOut, TL10nTranslateIn, TL10nTranslateOut } from './schemas'

export async function analyzeClip(apiBase: string, payload: TClipAnalyzeIn): Promise<TClipAnalyzeOut> {
  const res = await fetch(${apiBase}/api/clip/analyze, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error(Failed to analyze clip: )
  }

  return (await res.json()) as TClipAnalyzeOut
}

export async function translateRows(apiBase: string, payload: TL10nTranslateIn): Promise<TL10nTranslateOut> {
  const res = await fetch(${apiBase}/api/l10n/translate, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error(Failed to translate rows: )
  }

  return (await res.json()) as TL10nTranslateOut
}
