import Link from 'next/link'
import { type Locale } from '@/app/[lang]/dictionaries'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { nav } from '@/lib/nav'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  return {
    title: lang === 'zh' ? '文档' : 'Documentation',
    description:
      lang === 'zh'
        ? 'behest 完整文档：Rust 原生 AI Agent 运行时构建块'
        : 'Complete documentation for behest: Rust-native building blocks for production AI agent runtimes.',
    alternates: {
      canonical: `https://behest.dev/${lang}/docs`,
    },
  }
}

const COLOR_VAR: Record<string, string> = {
  cyan: 'var(--cyan)',
  accent: 'var(--accent)',
  pink: 'var(--pink)',
  yellow: 'var(--yellow)',
}

export default async function DocsIndexPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
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

  return (
    <article>
      <h1
        className="text-4xl font-bold tracking-tight mb-4"
        style={{ color: 'var(--fg-bright)' }}
      >
        {t('nav.docs')}
      </h1>
      <p
        className="text-lg mb-12 leading-relaxed"
        style={{ color: 'var(--muted)' }}
      >
        {lang === 'zh'
          ? '按组件维度组织：每一个运行时原语都有一份深度页面，包含完整 API、Mermaid 流程图、代码示例与错误语义。'
          : 'Organised by component. Every runtime primitive has a deep-dive page with full API surface, Mermaid diagrams, code examples, and error semantics.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nav.map((group) => {
          const color = COLOR_VAR[group.color] ?? 'var(--accent)'
          return (
            <Link
              key={group.id}
              href={`/${lang}/docs/${group.landing}`}
              className="block p-6 border-3 transition-all duration-100"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--surface)',
                boxShadow: `4px 4px 0 0 ${color}`,
                textDecoration: 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest"
                  style={{ color }}
                >
                  {t(group.titleKey)}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--muted)' }}
                >
                  {group.items.length} {t('home.items')}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--muted)' }}
              >
                {group.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.slice(0, 4).map((item) => (
                  <span
                    key={item.slug}
                    className="text-xs font-mono px-2 py-1"
                    style={{
                      color: 'var(--fg)',
                      background: 'var(--bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {t(item.titleKey)}
                  </span>
                ))}
                {group.items.length > 4 && (
                  <span
                    className="text-xs font-mono px-2 py-1"
                    style={{
                      color: 'var(--muted)',
                      background: 'var(--bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    +{group.items.length - 4}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </article>
  )
}
