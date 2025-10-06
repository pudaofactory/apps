export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          🚀 Turborepo Monorepo
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          基于 <strong>PNPM + Next.js + TypeScript + Tailwind</strong> 的现代化 Windows 开发环境
        </p>
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">系统状态</h2>
        <p className="text-sm text-slate-600">✅ 服务器运行正常</p>
        <p className="text-xs text-slate-500 mt-2">
          访问 <code className="rounded bg-slate-100 px-1 py-0.5">/api/health</code> 查看 API
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">下一步</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>集成共享 UI 组件 (@repo/ui)</li>
          <li>配置 ESLint 和 Prettier</li>
          <li>部署到 Vercel</li>
        </ol>
      </div>
    </main>
  )
}
