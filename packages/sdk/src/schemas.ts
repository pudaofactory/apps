import { z } from 'zod'

export const ClipAnalyzeIn = z.object({
  videoUrl: z.string().url(),
  transcript: z.string().min(10),
  targetLang: z.enum(['en', 'es', 'pt']),
  n: z.number().int().min(1).max(8)
})

export const ClipAnalyzeOut = z.object({
  clips: z.array(
    z.object({
      start: z.number(),
      end: z.number(),
      headline: z.string(),
      hook: z.string(),
      hashtags: z.array(z.string()),
      srt: z.string()
    })
  ),
  capcut: z.object({
    projectJson: z.unknown()
  })
})

export const L10nTranslateIn = z.object({
  fromLang: z.string().min(2),
  toLang: z.string().min(2),
  rows: z.array(
    z.object({
      id: z.string().optional(),
      text: z.string().min(1),
      context: z.string().optional()
    })
  )
})

export const L10nTranslateOut = z.object({
  rows: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      quality: z.enum(['draft', 'review']).default('draft')
    })
  )
})

export type TClipAnalyzeIn = z.infer<typeof ClipAnalyzeIn>
export type TClipAnalyzeOut = z.infer<typeof ClipAnalyzeOut>
export type TL10nTranslateIn = z.infer<typeof L10nTranslateIn>
export type TL10nTranslateOut = z.infer<typeof L10nTranslateOut>
