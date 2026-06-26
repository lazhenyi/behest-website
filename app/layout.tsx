import type { Metadata } from 'next'
import './globals.css'
import AnalyticsComponent from '@/components/Analytics'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  metadataBase: new URL('https://behest.dev'),
  title: {
    default: 'behest - Rust-native AI Agent Runtime',
    template: '%s | behest',
  },
  description: 'Rust-native building blocks for production AI agent runtimes. Type-safe, modular, provider-neutral agent framework.',
  keywords: ['rust', 'ai', 'agent', 'runtime', 'llm', 'openai', 'anthropic', 'framework', 'async'],
  authors: [{ name: 'lazhenyi', url: 'https://github.com/lazhenyi' }],
  creator: 'lazhenyi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://behest.dev',
    siteName: 'behest',
    title: 'behest - Rust-native AI Agent Runtime',
    description: 'Rust-native building blocks for production AI agent runtimes. Type-safe, modular, provider-neutral agent framework.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'behest - Rust-native AI Agent Runtime',
    description: 'Rust-native building blocks for production AI agent runtimes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <JsonLd type="website" />
        {children}
        <AnalyticsComponent />
      </body>
    </html>
  )
}
