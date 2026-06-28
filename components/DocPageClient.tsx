import JsonLd from './JsonLd'
import { type Locale } from '@/app/[lang]/dictionaries'
import { getDictionary } from '@/app/[lang]/dictionaries'
import TableOfContents from './TableOfContents'

type RelatedItem = {
  groupTitleKey: string
  itemTitleKey: string
  slug: string
}

type Props = {
  lang: Locale
  title: string
  description?: string
  html: string
  headings: { depth: 2 | 3; value: string; id: string }[]
  slug: string
  groupTitleKey: string
  itemTitleKey: string
  related: RelatedItem[]
}

/**
 * Server-rendered documentation page.
 *
 * Layout: full-width article + sticky right TOC. The TOC is rendered
 * server-side; client-side active-section highlighting lives in the
 * `<TableOfContents />` component.
 */
export default async function DocPageClient({
  lang,
  title,
  description,
  html,
  headings,
  slug,
  groupTitleKey,
  itemTitleKey,
  related,
}: Props) {
  const dict = await getDictionary(lang)
  const t = (key: string): string => {
    if (!key) return ''
    const parts = key.split('.')
    let cur: unknown = dict
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p]
      } else {
        return key
      }
    }
    return typeof cur === 'string' ? cur : key
  }
  const groupTitle = t(groupTitleKey)

  return (
    <>
      <JsonLd
        type="article"
        title={title}
        description={description}
        url={`https://behest.dev/${lang}/docs/${slug}`}
      />
      <div className="flex gap-12 items-start">
        <article className="flex-1 min-w-0">
          {groupTitle && (
            <p
              className="text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: 'var(--muted)' }}
            >
              {groupTitle}
            </p>
          )}
          <h1
            className="text-4xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--fg-bright)' }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="text-base mb-8 leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {description}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {related.length > 0 && (
            <section
              className="mt-16 pt-8"
              style={{ borderTop: '2px solid var(--border-subtle)' }}
            >
              <h2
                className="text-sm font-mono uppercase tracking-widest mb-4"
                style={{ color: 'var(--sage)' }}
              >
                {t('page.related')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <a
                    key={r.slug}
                    href={`/${lang}/docs/${r.slug}`}
                    className="clay-card clay-card-hover block p-4"
                    style={{ textDecoration: 'none' }}
                  >
                    <span
                      className="text-[10px] font-mono uppercase tracking-widest block mb-1"
                      style={{ color: 'var(--muted)' }}
                    >
                      {t(r.groupTitleKey)}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--accent)' }}
                    >
                      {t(r.itemTitleKey)}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Edit-on-GitHub link */}
          <p
            className="mt-12 text-xs font-mono"
            style={{ color: 'var(--muted)' }}
          >
            <a
              href={`https://github.com/lazhenyi/behest.dev/edit/main/docs/${lang}/${slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              {t('page.edit_on_github')}
            </a>
          </p>
        </article>

        <TableOfContents headings={headings} />
      </div>
    </>
  )
}
