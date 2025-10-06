'use client'

import { useEffect, useState } from 'react'
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
          <CardTitle>系统健康</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">加载中...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>系统健康</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❌</span>
            <div>
              <p className="text-sm font-medium text-red-600">错误</p>
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
        <CardTitle>系统健康</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{health?.ok ? '✅' : '❌'}</span>
          <div>
            <p className="text-sm font-medium text-green-600">
              {health?.ok ? 'Healthy' : 'Unhealthy'}
            </p>
            {health?.ts && (
              <p className="text-xs text-slate-500">
                {new Date(health.ts).toLocaleString('zh-CN')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          🚀 Turborepo Monorepo
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          基于 <strong>PNPM + Next.js + TypeScript + Tailwind</strong> 的现代化 Windows 开发环境
        </p>
      </section>

      {/* Health Check Widget */}
      <HealthWidget />

      {/* Demo: Shared UI Components */}
      <Card>
        <CardHeader>
          <CardTitle>共享 UI 组件演示 (@repo/ui)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Button 组件变体：</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="outline" size="lg">Outline Large</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              这些组件来自 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">@repo/ui</code> 共享包，
              可在整个 monorepo 中复用。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>下一步</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>查看 <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">/api/health</code> API 路由获取状态</li>
            <li>在 <code className="font-mono">packages/</code> 中添加更多共享包</li>
            <li>配置 ESLint、Prettier 和代码质量工具</li>
            <li>部署到 Vercel 或其他平台</li>
            <li>集成 PostHog/Sentry 进行监控和分析</li>
          </ol>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        <p>
          使用 <strong>Turborepo 2.0</strong> 构建 · Windows 10/11 优化 · PNPM 工作区
        </p>
      </footer>
    </main>
  )
}