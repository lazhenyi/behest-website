import { getDocBySlug, markdownToHtml } from '@/lib/docs'
import { type Locale } from '@/app/[lang]/dictionaries'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const doc = getDocBySlug(lang, 'index')
  return {
    title: 'behest',
    description: doc.frontmatter.description || 'Rust-native building blocks for production AI agent runtimes',
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
