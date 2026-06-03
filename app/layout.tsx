import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vigil — Uptime Monitoring for Developers',
  description: 'Free, open-source uptime monitoring. Pings your URLs every 5 minutes and emails you the moment something goes down.',
  openGraph: {
    title: 'Vigil — Uptime Monitoring for Developers',
    description: 'Free, open-source uptime monitoring. Pings your URLs every 5 minutes and emails you the moment something goes down.',
    url: 'https://vigil-mocha.vercel.app',
    siteName: 'Vigil',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vigil — Uptime Monitoring for Developers',
    description: 'Free, open-source uptime monitoring. Pings your URLs every 5 minutes and emails you the moment something goes down.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}