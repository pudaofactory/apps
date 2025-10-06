import { createHash } from 'crypto'
import { kvGet, kvPut } from './kv'

type TaskName = 'clip-analyze' | 'l10n-translate'

type AnyPayload = Record<string, unknown>

type ClipAnalyzeMock = {
  clips: Array<{
    start: number
    end: number
    headline: string
    hook: string
    hashtags: string[]
    srt: string
  }>
  capcut: {
    projectJson: Record<string, unknown>
  }
}

type L10nTranslateMock = {
  rows: Array<{
    source: string
    target: string
  }>
}

type MockResult = ClipAnalyzeMock | L10nTranslateMock

async function safeKvGet(key: string) {
  try {
    return await kvGet<MockResult>(key)
  } catch (error) {
    console.warn('[kvGet] failed', error)
    return null
  }
}

async function safeKvPut(key: string, value: MockResult) {
  try {
    await kvPut(key, value)
  } catch (error) {
    console.warn('[kvPut] failed', error)
  }
}

function hashPayload(task: TaskName, payload: AnyPayload) {
  return createHash('sha256').update(${task}:).digest('hex')
}

export async function callLLM(task: TaskName, payload: AnyPayload): Promise<MockResult> {
  const cacheKey = hashPayload(task, payload)
  const cached = await safeKvGet(cacheKey)

  if (cached) {
    return cached
  }

  const result = await mockLLM(task, payload)
  await safeKvPut(cacheKey, result)
  return result
}

async function mockLLM(task: TaskName, payload: AnyPayload): Promise<MockResult> {
  if (task === 'clip-analyze') {
    return {
      clips: [
        {
          start: 0,
          end: 45,
          headline: 'Hook: Why retention matters',
          hook: 'Stop losing viewers in the first 5 seconds',
          hashtags: ['#retention', '#ai'],
          srt: '0 0:00:00.000 --> 0:00:05.000\nRetention is your growth lever.'
        }
      ],
      capcut: {
        projectJson: {
          payloadSummary: payload
        }
      }
    }
  }

  return {
    rows: [
      {
        source: String(payload?.text ?? ''),
        target: 'Translated text placeholder'
      }
    ]
  }
}
