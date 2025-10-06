import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClipWedge · L10nGuard',
  description: 'Unified workspace for clip generation and localization.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
