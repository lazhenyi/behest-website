import type { Metadata } from 'next'
import '../globals.css'
import AnalyticsComponent from '@/components/Analytics'
import { i18n, type Locale } from './dictionaries'

export const metadata: Metadata = {
  title: 'behest',
  description: 'Rust-native building blocks for production AI agent runtimes',
}

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        {children}
        <AnalyticsComponent />
      </body>
    </html>
  )
}
