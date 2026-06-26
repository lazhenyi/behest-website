import { getDocBySlug, markdownToHtml, getAllDocs } from '@/lib/docs'
import { notFound } from 'next/navigation'
import { type Locale } from '@/app/[lang]/dictionaries'
import JsonLd from '@/components/JsonLd'

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
    const title = doc.frontmatter.title || slug
    const description = doc.frontmatter.description || ''
    return {
      title,
      description,
      alternates: {
        canonical: `https://behest.dev/${lang}/docs/${slug}`,
      },
      openGraph: {
        title: `${title} | behest`,
        description,
        type: 'article',
        url: `https://behest.dev/${lang}/docs/${slug}`,
      },
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
      <>
        <JsonLd
          type="article"
          title={doc.frontmatter.title || slug}
          description={doc.frontmatter.description}
          url={`https://behest.dev/${lang}/docs/${slug}`}
        />
        <article>
          <h1 className="text-3xl font-bold mb-6">{doc.frontmatter.title || slug}</h1>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </>
    )
  } catch {
    notFound()
  }
}
