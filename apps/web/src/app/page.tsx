'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@repo/ui'

interface HealthResponse {
  ok: boolean
  ts: string
}

function HealthWidget() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl">!</span>
            <div>
              <p className="text-sm font-medium text-red-600">Error</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{health?.ok ? 'OK' : 'FAIL'}</span>
          <div>
            <p className="text-sm font-medium text-green-600">
              {health?.ok ? 'Healthy' : 'Unhealthy'}
            </p>
            {health?.ts && (
              <p className="text-xs text-slate-500">
                {new Date(health.ts).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [actionResult, setActionResult] = useState('No request yet')
  const [actionError, setActionError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<'clip' | 'l10n' | null>(
    null
  )

  const runAction = useCallback(async (type: 'clip' | 'l10n') => {
    const endpoint = type === 'clip' ? '/api/clip/analyze' : '/api/l10n/translate'
    setLoadingAction(type)
    setActionError(null)

    try {
      const response = await fetch(endpoint, { method: 'POST' })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Request failed')
      }

      setActionResult(JSON.stringify(data, null, 2))
      window.dispatchEvent(new Event('credits:refresh'))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingAction(null)
    }
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight">Turborepo Monorepo</h1>
        <p className="mt-3 text-lg text-slate-600">
          A modern Windows-friendly stack built with{' '}
          <strong>PNPM + Next.js + TypeScript + Tailwind</strong>.
        </p>
      </section>

      <HealthWidget />

      <Card>
        <CardHeader>
          <CardTitle>Credit Consumption Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Anonymous UID + Prisma transaction powered mock endpoints for the pre-payment loop.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              disabled={loadingAction === 'clip'}
              onClick={() => runAction('clip')}
            >
              {loadingAction === 'clip' ? 'Running...' : 'Run Clip Analyze (uses 1 credit)'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={loadingAction === 'l10n'}
              onClick={() => runAction('l10n')}
            >
              {loadingAction === 'l10n'
                ? 'Running...'
                : 'Run L10n Translate (uses 5 credits)'}
            </Button>
          </div>

          {actionError && (
            <p className="rounded bg-red-50 p-2 text-xs text-red-600">
              {actionError}
            </p>
          )}

          <pre className="max-h-64 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
            {actionResult}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>@repo/ui Showcase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Button variants:</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">
                Primary Small
              </Button>
              <Button variant="primary" size="md">
                Primary Medium
              </Button>
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="outline" size="lg">
                Outline Large
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              Components are published from{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
                @repo/ui
              </code>{' '}
              and shared across the monorepo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Inspect{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                /api/health
              </code>{' '}
              to verify infrastructure.
            </li>
            <li>Add more shared packages under <code className="font-mono">packages/</code>.</li>
            <li>Wire up ESLint, Prettier, and additional QA tooling.</li>
            <li>Deploy to Vercel or your preferred hosting target.</li>
            <li>Integrate PostHog/Sentry for analytics and monitoring.</li>
          </ol>
        </CardContent>
      </Card>

      <footer className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        <p>
          Built with <strong>Turborepo 2.0</strong> - Optimised for Windows 10/11 - PNPM workflow
        </p>
      </footer>
    </main>
  )
}
