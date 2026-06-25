import type { Metadata } from 'next'
import './globals.css'
import AnalyticsComponent from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'behest',
  description: 'Rust-native building blocks for production AI agent runtimes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <AnalyticsComponent />
      </body>
    </html>
  )
}
