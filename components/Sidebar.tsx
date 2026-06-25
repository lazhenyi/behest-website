'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type Locale } from '@/app/[lang]/dictionaries'

interface SidebarProps {
  lang: Locale
  dict: any
}

export default function Sidebar({ lang, dict }: SidebarProps) {
  const pathname = usePathname()

  const sections = [
    {
      title: dict.sidebar.getting_started,
      color: 'var(--cyan)',
      items: [
        { name: dict.sidebar.introduction, href: `/${lang}/docs` },
        { name: dict.sidebar.quick_start, href: `/${lang}/docs/getting-started` },
        { name: dict.sidebar.examples, href: `/${lang}/docs/examples` },
      ],
    },
    {
      title: dict.sidebar.core_concepts,
      color: 'var(--accent)',
      items: [
        { name: dict.sidebar.providers, href: `/${lang}/docs/providers` },
        { name: dict.sidebar.tools, href: `/${lang}/docs/tools` },
        { name: dict.sidebar.sessions, href: `/${lang}/docs/sessions` },
        { name: dict.sidebar.storage, href: `/${lang}/docs/storage` },
        { name: dict.sidebar.configuration, href: `/${lang}/docs/configuration` },
        { name: dict.sidebar.error_handling, href: `/${lang}/docs/error-handling` },
      ],
    },
    {
      title: dict.sidebar.advanced,
      color: 'var(--pink)',
      items: [
        { name: dict.sidebar.architecture, href: `/${lang}/docs/architecture` },
        { name: dict.sidebar.rag, href: `/${lang}/docs/rag` },
        { name: dict.sidebar.events, href: `/${lang}/docs/events` },
        { name: dict.sidebar.feature_flags, href: `/${lang}/docs/features` },
        { name: dict.sidebar.api_reference, href: `/${lang}/docs/api-reference` },
      ],
    },
    {
      title: dict.sidebar.development,
      color: 'var(--yellow)',
      items: [
        { name: dict.sidebar.development_guide, href: `/${lang}/docs/development` },
      ],
    },
  ]

  return (
    <aside
      className="w-64 min-h-screen border-r-3 p-4 hidden lg:block"
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'var(--surface)',
      }}
    >
      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3
              className="text-xs font-mono font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
              style={{
                color: section.color,
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span
                className="inline-block w-2 h-2 mr-2"
                style={{ background: section.color }}
              />
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-sm font-mono transition-all duration-100 border-l-3"
                      style={{
                        background: isActive ? 'var(--accent-soft)' : 'transparent',
                        color: isActive ? 'var(--cyan)' : 'var(--muted)',
                        borderColor: isActive ? 'var(--accent)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--fg)'
                          e.currentTarget.style.background = 'var(--surface-overlay)'
                          e.currentTarget.style.borderColor = 'var(--border-subtle)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--muted)'
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'transparent'
                        }
                      }}
                    >
                      {isActive && (
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2"
                          style={{ background: 'var(--accent)' }}
                        />
                      )}
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Decorative corner */}
      <div
        className="mt-8 p-3 border-3"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg)',
        }}
      >
        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>{'>'}</span> Built with Rust
        </p>
        <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--cyan)' }}>{'>'}</span> Type-safe by default
        </p>
      </div>
    </aside>
  )
}
