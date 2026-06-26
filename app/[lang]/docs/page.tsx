import { getDocBySlug, markdownToHtml } from '@/lib/docs'
import { type Locale } from '@/app/[lang]/dictionaries'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const doc = getDocBySlug(lang, 'index')
  const title = lang === 'zh' ? '文档' : 'Documentation'
  const description = doc.frontmatter.description || (lang === 'zh'
    ? 'behest 完整文档：Rust 原生 AI Agent 运行时构建块'
    : 'Complete documentation for behest: Rust-native building blocks for production AI agent runtimes')
  return {
    title,
    description,
    alternates: {
      canonical: `https://behest.dev/${lang}/docs`,
    },
  }
}

export default async function DocsIndexPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const doc = getDocBySlug(lang, 'index')
  const content = await markdownToHtml(doc.content)

  return (
    <article>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  )
}
