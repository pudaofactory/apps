'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui'

interface HealthResponse {
  ok: boolean
  ts: string
}

export function HealthWidget() {
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


