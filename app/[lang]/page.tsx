import type { Metadata } from 'next'
import { type Locale, getDictionary } from '@/app/[lang]/dictionaries'
import HomePage from '@/components/HomePage'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const title = lang === 'zh' ? 'behest - Rust 原生 AI Agent 运行时' : 'behest - Rust-native AI Agent Runtime'
  const description = lang === 'zh'
    ? 'Rust 原生的生产级 AI Agent 运行时构建块。类型安全、模块化、供应商中立的 Agent 框架。'
    : 'Rust-native building blocks for production AI agent runtimes. Type-safe, modular, provider-neutral agent framework.'

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `https://behest.dev/${lang}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://behest.dev/${lang}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <HomePage lang={lang} dict={dict} />
}
