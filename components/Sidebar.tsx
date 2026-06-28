'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type Locale } from '@/app/[lang]/dictionaries'
import { nav, type NavColor, type NavGroup, type NavItem } from '@/lib/nav'

type Dict = {
  nav?: {
    groups?: Record<string, { title?: string }>
    pages?: Record<string, string>
  }
  sidebar?: Record<string, string>
  page?: { on_this_page?: string; related?: string; edit_on_github?: string }
}

interface SidebarProps {
  lang: Locale
  dict: Dict
}

function colorVar(c: NavColor): string {
  const map: Record<NavColor, string> = {
    cyan: 'var(--sage)',
    accent: 'var(--accent)',
    pink: 'var(--coral)',
    yellow: 'var(--warm-yellow)',
  }
  return map[c]
}

function resolveTitle(dict: Dict, key: string | undefined): string {
  if (!key) return ''
  if (key.startsWith('nav.pages.')) {
    const slug = key.slice('nav.pages.'.length)
    return dict.nav?.pages?.[slug] ?? slug
  }
  if (key.startsWith('nav.groups.')) {
    const id = key.slice('nav.groups.'.length)
    return dict.nav?.groups?.[id]?.title ?? id
  }
  return key
}

export default function Sidebar({ lang, dict }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 h-screen p-4 hidden lg:block shrink-0 sticky top-0 overflow-y-auto"
      style={{ background: 'var(--bg)' }}
    >
      <nav className="space-y-6 py-4">
        {nav.map((group) => (
          <NavSection
            key={group.id}
            group={group}
            lang={lang}
            pathname={pathname}
            dict={dict}
          />
        ))}
      </nav>

      {/* Decorative footer */}
      <div
        className="mt-8 p-4"
        style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          boxShadow: 'var(--clay-shadow-sm)',
        }}
      >
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>{'>'}</span> Built with Rust
        </p>
        <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--sage)' }}>{'>'}</span> Type-safe by default
        </p>
      </div>
    </aside>
  )
}

function NavSection({
  group,
  lang,
  pathname,
  dict,
}: {
  group: NavGroup
  lang: Locale
  pathname: string
  dict: Dict
}) {
  return (
    <div>
      <h3
        className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-2 flex items-center gap-2"
        style={{
          color: colorVar(group.color),
        }}
      >
        <span
          className="inline-block w-2 h-2"
          style={{
            background: colorVar(group.color),
            borderRadius: '50%',
          }}
        />
        {resolveTitle(dict, group.titleKey)}
      </h3>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <NavLink
            key={item.slug}
            item={item}
            lang={lang}
            pathname={pathname}
            dict={dict}
          />
        ))}
      </ul>
    </div>
  )
}

function NavLink({
  item,
  lang,
  pathname,
  dict,
}: {
  item: NavItem
  lang: Locale
  pathname: string
  dict: Dict
}) {
  const href = `/${lang}/docs/${item.slug}`
  const isActive = pathname === href || pathname === `${href}/`
  const title = resolveTitle(dict, item.titleKey)

  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-2 text-sm transition-all duration-200"
        style={{
          background: isActive ? 'var(--accent-soft)' : 'transparent',
          color: isActive ? 'var(--accent)' : 'var(--muted)',
          borderRadius: '12px',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = 'var(--fg)'
            e.currentTarget.style.background = 'var(--surface)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = 'var(--muted)'
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <span className="flex items-center gap-2">
          {isActive && (
            <span
              className="inline-block w-1.5 h-1.5"
              style={{
                background: 'var(--accent)',
                borderRadius: '50%',
              }}
            />
          )}
          <span className="flex-1">{title}</span>
          {item.badge && (
            <span
              className="text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold"
              style={{
                background: 'var(--coral-soft)',
                color: 'var(--coral)',
                borderRadius: '50px',
              }}
            >
              {item.badge}
            </span>
          )}
        </span>
      </Link>
    </li>
  )
}
