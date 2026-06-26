'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen grid-bg relative flex items-center justify-center">
      <div className="noise absolute inset-0 pointer-events-none" />
      <div className="text-center relative z-10 px-4">
        <h1
          className="text-7xl sm:text-8xl font-bold font-mono uppercase tracking-tighter mb-4"
          style={{ color: 'var(--accent)' }}
        >
          <span className="neon-purple">404</span>
        </h1>
        <p className="text-lg font-mono mb-8" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--pink)' }}>{'>'}</span> Page not found
        </p>
        <Link
          href="/en"
          className="inline-block px-8 py-3 font-mono font-bold uppercase tracking-wider text-sm border-3 transition-all duration-100"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            borderColor: 'var(--accent)',
            boxShadow: '4px 4px 0 0 var(--cyan)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)'
            e.currentTarget.style.boxShadow = '6px 6px 0 0 var(--cyan)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)'
            e.currentTarget.style.boxShadow = '4px 4px 0 0 var(--cyan)'
          }}
        >
          Go Home →
        </Link>
      </div>
    </div>
  )
}
