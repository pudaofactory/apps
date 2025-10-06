import { useState } from 'react'
import type { TClipAnalyzeOut } from '@repo/sdk'
import { analyzeClip } from '@repo/sdk'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type Status = 'idle' | 'loading' | 'error' | 'done'

type TranscriptResponse = {
  transcript: string | null
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function requestTranscript(tabId: number) {
  try {
    return (await chrome.tabs.sendMessage(tabId, { type: 'GET_TRANSCRIPT' })) as TranscriptResponse
  } catch (error) {
    console.warn('[popup] transcript request failed', error)
    return { transcript: null }
  }
}

export function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TClipAnalyzeOut | null>(null)

  async function onAnalyze() {
    setStatus('loading')
    setError(null)

    const tab = await getActiveTab()

    if (!tab?.id || !tab.url) {
      setStatus('error')
      setError('No active tab detected.')
      return
    }

    const { transcript } = await requestTranscript(tab.id)

    try {
      const payload = {
        videoUrl: tab.url,
        transcript: transcript ?? 'manual transcript placeholder',
        targetLang: 'en',
        n: 6
      }

      const response = await analyzeClip(API_BASE_URL, payload)
      setResult(response)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setError('Failed to call API.')
      setStatus('error')
    }
  }

  return (
    <div className="container">
      <h1>ClipWedge</h1>
      <p className="hint">Analyze the current YouTube video and fetch recommended clip segments.</p>
      <button className="action" onClick={onAnalyze} disabled={status === 'loading'}>
        {status === 'loading' ? 'Analyzing…' : 'Find Clips'}
      </button>
      {error ? <p className="error">{error}</p> : null}
      {status === 'done' && result ? (
        <div className="card">
          <p className="card-title">Top suggestion</p>
          <p className="card-body">{result.clips[0]?.headline ?? 'No headline available.'}</p>
        </div>
      ) : null}
    </div>
  )
}
