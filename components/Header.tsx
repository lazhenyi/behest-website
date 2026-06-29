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
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(250, 250, 250, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              <span>behest</span>
              <span
                className="ml-2 text-[10px] font-semibold px-2.5 py-0.5"
                style={{
                  color: '#262626',
                  background: '#63fe13',
                  borderRadius: '3px',
                }}
              >
                v0.4.1
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href={`/${lang}/docs`}
                className="px-4 py-2 text-sm font-medium tracking-wide"
                style={{
                  color: 'var(--fg)',
                  borderRadius: '5px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-overlay)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {dict.nav.docs}
              </Link>
              <a
                href="https://github.com/lazhenyi/behest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium tracking-wide flex items-center gap-1.5"
                style={{
                  color: 'var(--fg)',
                  borderRadius: '5px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-overlay)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                GitHub
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 2.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" />
                  <path d="M7 1.5h3.5v3.5" />
                  <path d="M10.5 1.5l-7 7" />
                </svg>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div
              className="flex items-center text-xs font-medium overflow-hidden"
              style={{
                background: 'var(--surface-overlay)',
                borderRadius: '5px',
                border: '1px solid var(--border)',
              }}
            >
              {i18n.locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => router.push(redirectedPathname(locale))}
                  className="px-3.5 py-1.5 transition-all duration-100 cursor-pointer"
                  style={{
                    background: locale === lang ? 'var(--accent)' : 'transparent',
                    color: locale === lang ? '#fff' : 'var(--muted)',
                    borderRadius: '4px',
                    border: 'none',
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
