'use client'

import Link from 'next/link'
import { type Locale } from '@/app/[lang]/dictionaries'
import { nav, type NavColor } from '@/lib/nav'

const COLOR_VAR: Record<NavColor, string> = {
  cyan: 'var(--sage)',
  accent: 'var(--accent)',
  pink: 'var(--coral)',
  yellow: 'var(--warm-yellow)',
}

type Dict = {
  nav?: {
    home?: string
    docs?: string
    github?: string
    groups?: Record<string, { title?: string }>
    pages?: Record<string, string>
  }
  home?: {
    tag?: string
    tagline?: string
    get_started?: string
    source_code?: string
    browse_by_component?: string
    browse_by_component_subtitle?: string
    view_all?: string
    items?: string
  }
}

const t = (dict: Dict, key: string): string => {
  const parts = key.split('.')
  let cur: unknown = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return key
    }
  }
  // If we reached an object with a .title property, use that (for nav.groups.*)
  if (cur && typeof cur === 'object' && 'title' in (cur as Record<string, unknown>)) {
    const title = (cur as Record<string, unknown>).title
    return typeof title === 'string' ? title : key
  }
  return typeof cur === 'string' ? cur : key
}

export default function HomePage({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--clay-shadow-sm)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${lang}`}
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--accent)' }}
            >
              <span>behest</span>
              <span
                className="ml-2 text-[10px] font-semibold px-2.5 py-0.5"
                style={{
                  color: 'var(--coral)',
                  background: 'var(--coral-soft)',
                  borderRadius: '50px',
                }}
              >
                v0.4
              </span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link
                href={`/${lang}/docs`}
                className="px-4 py-2 text-sm font-medium tracking-wide"
                style={{
                  color: 'var(--fg)',
                  borderRadius: '50px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-overlay)'
                  e.currentTarget.style.boxShadow = 'var(--clay-shadow-sm)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {t(dict, 'nav.docs')}
              </Link>
              <a
                href="https://github.com/lazhenyi/behest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium tracking-wide flex items-center gap-1.5"
                style={{
                  color: 'var(--fg)',
                  borderRadius: '50px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-overlay)'
                  e.currentTarget.style.boxShadow = 'var(--clay-shadow-sm)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {t(dict, 'nav.github')}
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Tag badge */}
          <div
            className="clay-badge mx-auto mb-8"
            style={{ color: 'var(--accent)' }}
          >
            <span
              className="w-2 h-2 animate-pulse"
              style={{
                background: 'var(--accent)',
                borderRadius: '50%',
              }}
            />
            <span className="font-mono uppercase">{t(dict, 'home.tag')}</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            <span className="sr-only">behest - Rust-native AI Agent Runtime</span>
            <span
              aria-hidden="true"
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--coral) 50%, var(--sage) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              behest
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--muted)' }}
          >
            <span style={{ color: 'var(--accent)' }}>{'>'}</span>{' '}
            {t(dict, 'home.tagline')}
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              href={`/${lang}/docs/intro/quick-start`}
              className="clay-btn-primary px-8 py-3.5 font-semibold text-sm tracking-wide"
            >
              {t(dict, 'home.get_started')} →
            </Link>
            <a
              href="https://github.com/lazhenyi/behest"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-secondary px-8 py-3.5 font-semibold text-sm tracking-wide"
            >
              {t(dict, 'home.source_code')}
            </a>
          </div>

          {/* Code preview */}
          <div
            className="mt-14 max-w-2xl mx-auto text-left p-6"
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              boxShadow: 'var(--clay-shadow)',
              border: 'none',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-3 h-3"
                style={{ background: 'var(--coral)', borderRadius: '50%' }}
              />
              <span
                className="w-3 h-3"
                style={{ background: 'var(--warm-yellow)', borderRadius: '50%' }}
              />
              <span
                className="w-3 h-3"
                style={{ background: 'var(--sage)', borderRadius: '50%' }}
              />
              <span
                className="ml-2 text-xs font-mono"
                style={{ color: 'var(--muted)' }}
              >
                main.rs
              </span>
            </div>
            <pre
              className="!bg-transparent !border-0 !p-0 !m-0 !shadow-none text-sm"
              style={{ boxShadow: 'none' }}
            >
              <code>
                <span style={{ color: 'var(--accent)' }}>use</span>{' '}
                <span style={{ color: 'var(--sage)' }}>behest</span>::{'{'}
                <span style={{ color: 'var(--coral)' }}>AgentRuntime</span>,{' '}
                <span style={{ color: 'var(--coral)' }}>Extensions</span>
                {'}'};{'\n'}
                {'\n'}
                <span style={{ color: 'var(--accent)' }}>let</span> exts ={' '}
                <span style={{ color: 'var(--coral)' }}>Extensions</span>::new();{'\n'}
                {'  '}
                <span style={{ color: 'var(--muted)' }}>// hot-swap any provider at runtime</span>
                {'\n'}
                {'  '}
                <span style={{ color: 'var(--muted)' }}>// </span>
                <span style={{ color: 'var(--warm-yellow)' }}>exts.chat_providers.register_or_replace</span>
                (…);{'\n'}
                {'\n'}
                <span style={{ color: 'var(--accent)' }}>let</span> runtime ={' '}
                <span style={{ color: 'var(--coral)' }}>AgentRuntime</span>::new(exts, policy).await?;
              </code>
            </pre>
          </div>
        </div>

        {/* Component card grid */}
        <section className="mt-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--fg-bright)' }}
              >
                {t(dict, 'home.browse_by_component')}
              </h2>
              <p
                className="text-sm mt-2"
                style={{ color: 'var(--muted)' }}
              >
                {t(dict, 'home.browse_by_component_subtitle')}
              </p>
            </div>
            <Link
              href={`/${lang}/docs`}
              className="text-sm font-medium"
              style={{ color: 'var(--accent)' }}
            >
              {t(dict, 'home.view_all')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nav.map((group) => {
              const color = COLOR_VAR[group.color]
              return (
                <Link
                  key={group.id}
                  href={`/${lang}/docs/${group.landing}`}
                  className="clay-card clay-card-hover block p-6"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-widest"
                      style={{ color }}
                    >
                      {group.id}
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-0.5"
                      style={{
                        color: 'var(--muted)',
                        background: 'var(--bg)',
                        borderRadius: '50px',
                      }}
                    >
                      {group.items.length}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: 'var(--fg-bright)' }}
                  >
                    {t(dict, group.titleKey)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted)' }}
                  >
                    {group.summary}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Bottom decorative divider */}
        <div className="mt-28 flex items-center gap-4">
          <div
            className="flex-1"
            style={{
              height: '2px',
              background: 'var(--border-subtle)',
              borderRadius: '1px',
            }}
          />
          <span
            className="text-xs tracking-widest"
            style={{ color: 'var(--muted)' }}
          >
            Built with Rust // Powered by AI
          </span>
          <div
            className="flex-1"
            style={{
              height: '2px',
              background: 'var(--border-subtle)',
              borderRadius: '1px',
            }}
          />
        </div>
      </main>
    </div>
  )
}
