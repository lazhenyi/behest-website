import { getDocBySlug, markdownToHtml, getAllDocs } from '@/lib/docs'
import { notFound } from 'next/navigation'
import { type Locale } from '@/app/[lang]/dictionaries'

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh']
  const params: { lang: string; slug: string }[] = []

  for (const lang of locales) {
    const docs = getAllDocs(lang)
    docs.forEach((doc) => {
      params.push({ lang, slug: doc.slug })
    })
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params
  try {
    const doc = getDocBySlug(lang, slug)
    return {
      title: `${doc.frontmatter.title || slug} | behest`,
      description: doc.frontmatter.description || '',
    }
  } catch {
    return {
      title: 'behest',
    }
  }
}

export default async function DocPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params
  try {
    const doc = getDocBySlug(lang, slug)
    const content = await markdownToHtml(doc.content)

    return (
      <article>
        <h1 className="text-3xl font-bold mb-6">{doc.frontmatter.title || slug}</h1>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    )
  } catch {
    notFound()
  }
}
