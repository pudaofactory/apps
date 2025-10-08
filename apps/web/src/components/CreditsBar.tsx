'use client'

import { useCallback, useEffect, useState } from 'react'

type Credits = {
  clip: number
  l10n: number
}

type SessionResponse = {
  ok: boolean
  uid: string
  plan: string
  credits: Credits
}

async function fetchJson(path: string): Promise<SessionResponse | null> {
  try {
    const response = await fetch(path, { cache: 'no-store' })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as SessionResponse
  } catch {
    return null
  }
}

export default function CreditsBar() {
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('FREE')
  const [credits, setCredits] = useState<Credits>({ clip: 0, l10n: 0 })
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [sessionData, meData] = await Promise.all([
      fetchJson('/api/session/init'),
      fetchJson('/api/me')
    ])

    const data = sessionData ?? meData

    if (!data || !data.ok) {
      setError('Unable to fetch credits')
      setLoading(false)
      return
    }

    setPlan(data.plan ?? 'FREE')
    setCredits(data.credits ?? { clip: 0, l10n: 0 })
    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    const handler = () => {
      load()
    }

    window.addEventListener('credits:refresh', handler)
    return () => window.removeEventListener('credits:refresh', handler)
  }, [load])

  return (
    <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-slate-100 sm:text-sm">
      <div className="flex items-center gap-3">
        <span className="font-semibold tracking-wide">
          Plan: {loading ? 'Loading...' : plan}
        </span>
        <span className="text-slate-300">
          Credits: clip {loading ? '...' : credits.clip} / l10n{' '}
          {loading ? '...' : credits.l10n}
        </span>
        {error && <span className="text-red-300">{error}</span>}
      </div>
      <a
        href="/en/billing"
        className="rounded border border-slate-700 px-2 py-1 font-medium text-slate-200 hover:bg-slate-800"
      >
        Get more
      </a>
    </div>
  )
}
