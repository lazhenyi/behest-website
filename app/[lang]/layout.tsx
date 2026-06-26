import type { Metadata } from 'next'
import '../globals.css'
import AnalyticsComponent from '@/components/Analytics'
import JsonLd from '@/components/JsonLd'
import { i18n, type Locale } from './dictionaries'

const localeMap: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://behest.dev'
  const locale = localeMap[lang]

  return {
    title: {
      default: lang === 'zh' ? 'behest - Rust 原生 AI Agent 运行时' : 'behest - Rust-native AI Agent Runtime',
      template: '%s | behest',
      absolute: lang === 'zh' ? 'behest - Rust 原生 AI Agent 运行时' : 'behest - Rust-native AI Agent Runtime',
    },
    description:
      lang === 'zh'
        ? 'Rust 原生的生产级 AI Agent 运行时构建块。类型安全、模块化、供应商中立的 Agent 框架。'
        : 'Rust-native building blocks for production AI agent runtimes. Type-safe, modular, provider-neutral agent framework.',
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      locale,
      url: `${baseUrl}/${lang}`,
    },
  }
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
        {i18n.locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://behest.dev/${locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://behest.dev/en" />
      </head>
      <body className="font-sans">
        <JsonLd type="software" />
        {children}
        <AnalyticsComponent />
      </body>
    </html>
  )
}
