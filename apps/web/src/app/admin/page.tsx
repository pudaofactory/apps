import { prisma } from '@/server/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [users, usageEvents] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        credits: true,
        subscription: true
      }
    }),
    prisma.usageEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  ])

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Development-only view. Requests to /admin in non-production require BASIC_AUTH.
        </p>
      </header>

      <section className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-800">Latest users (20)</h2>
        <pre className="max-h-96 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
          {JSON.stringify(users, null, 2)}
        </pre>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-800">Usage events (20)</h2>
        <pre className="max-h-96 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
          {JSON.stringify(usageEvents, null, 2)}
        </pre>
      </section>
    </main>
  )
}
