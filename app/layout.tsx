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
      <meta name="google-site-verification" content="5boXUk1QzpXwrGhC1-tFzrbw9u4NstAuIsBXBHN6StM" />
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}