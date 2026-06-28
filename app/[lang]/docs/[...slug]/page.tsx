import { getDocBySlug, docExists } from '@/lib/docs'
import { markdownToHtml } from '@/lib/markdown'
import { findItem } from '@/lib/nav'
import { type Locale } from '@/app/[lang]/dictionaries'
import DocPageClient from '@/components/DocPageClient'
import { notFound } from 'next/navigation'
import MermaidClient from '@/components/MermaidClient'
import { allSlugs } from '@/lib/nav'

type Props = {
  params: Promise<{ lang: Locale; slug: string[] }>
}

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh']
  const params: { lang: string; slug: string[] }[] = []

  for (const lang of locales) {
    for (const slug of allSlugs()) {
      if (docExists(lang, slug)) {
        params.push({ lang, slug: slug.split('/') })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params
  const joined = slug.join('/')
  try {
    const doc = getDocBySlug(lang, joined)
    const title = doc.frontmatter.title ?? joined
    const description = doc.frontmatter.description ?? ''
    return {
      title,
      description,
      alternates: {
        canonical: `https://behest.dev/${lang}/docs/${joined}`,
        languages: {
          en: `https://behest.dev/en/docs/${joined}`,
          zh: `https://behest.dev/zh/docs/${joined}`,
        },
      },
      openGraph: {
        title: `${title} | behest`,
        description,
        type: 'article',
        url: `https://behest.dev/${lang}/docs/${joined}`,
      },
    }
  } catch {
    return { title: 'behest' }
  }
}

export default async function DocPage({ params }: Props) {
  const { lang, slug } = await params
  const joined = slug.join('/')

  let doc
  try {
    doc = getDocBySlug(lang, joined)
  } catch {
    notFound()
  }

  const { html, headings } = await markdownToHtml(doc.content)
  const nav = findItem(joined)
  const related = (doc.frontmatter.related ?? [])
    .map((s) => findItem(s))
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return (
    <>
      <DocPageClient
        lang={lang}
        title={doc.frontmatter.title ?? joined}
        description={doc.frontmatter.description}
        html={html}
        headings={headings}
        slug={joined}
        groupTitleKey={nav?.group.titleKey ?? ''}
        itemTitleKey={nav?.item.titleKey ?? ''}
        related={related.map((r) => ({
          groupTitleKey: r.group.titleKey,
          itemTitleKey: r.item.titleKey,
          slug: r.item.slug,
        }))}
      />
      <MermaidClient />
    </>
  )
}
