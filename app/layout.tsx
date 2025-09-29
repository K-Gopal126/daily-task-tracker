import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daily Work Tracker',
  description: 'Track your daily tasks and productivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="hydrated">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}