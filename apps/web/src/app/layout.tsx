import './globals.css'
import type { Metadata } from 'next'
import CreditsBar from '@/components/CreditsBar'

export const metadata: Metadata = {
  title: 'ClipWedge & L10nGuard',
  description: 'Unified workspace for clip generation and localization.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <CreditsBar />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
