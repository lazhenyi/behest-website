'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type Locale, i18n } from '@/app/[lang]/dictionaries'

interface HeaderProps {
  lang: Locale
  dict: any
}

export default function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <header
      className="sticky top-0 z-50 border-b-3"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--accent)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="text-lg font-bold tracking-tight font-mono uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              <span className="neon-cyan">behest</span>
              <span
                className="ml-1 text-xs font-normal px-1.5 py-0.5 border-2"
                style={{
                  color: 'var(--pink)',
                  borderColor: 'var(--pink)',
                }}
              >
                v0.1
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href={`/${lang}/docs`}
                className="px-3 py-1.5 text-sm font-mono uppercase tracking-wider border-2 transition-all duration-100"
                style={{
                  color: 'var(--fg)',
                  borderColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--cyan)'
                  e.currentTarget.style.borderColor = 'var(--cyan)'
                  e.currentTarget.style.boxShadow = '2px 2px 0 0 var(--cyan)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--fg)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {dict.nav.docs}
              </Link>
              <a
                href="https://github.com/lazhenyi/behest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-mono uppercase tracking-wider border-2 transition-all duration-100 flex items-center gap-1.5"
                style={{
                  color: 'var(--fg)',
                  borderColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--pink)'
                  e.currentTarget.style.borderColor = 'var(--pink)'
                  e.currentTarget.style.boxShadow = '2px 2px 0 0 var(--pink)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--fg)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                GitHub
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M3.5 2.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" />
                  <path d="M7 1.5h3.5v3.5" />
                  <path d="M10.5 1.5l-7 7" />
                </svg>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center border-3 text-xs font-mono font-bold uppercase overflow-hidden"
              style={{ borderColor: 'var(--accent)' }}
            >
              {i18n.locales.map((locale, i) => (
                <button
                  key={locale}
                  onClick={() => router.push(redirectedPathname(locale))}
                  className="px-3 py-1.5 transition-all duration-100 cursor-pointer"
                  style={{
                    background: locale === lang ? 'var(--accent)' : 'transparent',
                    color: locale === lang ? '#fff' : 'var(--muted)',
                    borderRight: i < i18n.locales.length - 1 ? '2px solid var(--accent)' : 'none',
                  }}
                >
                  {locale === 'en' ? 'EN' : '中'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
