'use client'

import Link from 'next/link'
import { type Locale } from '@/app/[lang]/dictionaries'

export default function HomePage({ lang }: { lang: Locale }) {
  return (
    <div className="min-h-screen grid-bg relative">
      {/* Noise overlay */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b-3"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--accent)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href={`/${lang}`}
              className="text-lg font-bold tracking-tight font-mono uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              <span className="neon-cyan">behest</span>
            </Link>
            <nav className="flex items-center gap-2">
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
                Docs
              </Link>
              <a
                href="https://github.com/lazhenyi/behest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-mono uppercase tracking-wider border-2 transition-all duration-100"
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
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Decorative tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border-2 font-mono text-xs uppercase tracking-widest"
            style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
              background: 'var(--accent-soft)',
            }}
          >
            <span className="w-2 h-2 animate-pulse" style={{ background: 'var(--pink)' }} />
            Rust-Native AI Agent Runtime
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-mono uppercase tracking-tighter mb-6">
            <span className="neon-purple" style={{ color: 'var(--accent)' }}>be</span>
            <span className="neon-cyan" style={{ color: 'var(--cyan)' }}>hest</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-mono" style={{ color: 'var(--muted)' }}>
            <span style={{ color: 'var(--pink)' }}>{'>'}</span>{' '}
            Building blocks for production AI agent runtimes
            <span className="animate-pulse">_</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              href={`/${lang}/docs/getting-started`}
              className="px-8 py-3 font-mono font-bold uppercase tracking-wider text-sm border-3 transition-all duration-100"
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
              Get Started →
            </Link>
            <a
              href="https://github.com/lazhenyi/behest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 font-mono font-bold uppercase tracking-wider text-sm border-3 transition-all duration-100"
              style={{
                background: 'transparent',
                color: 'var(--fg)',
                borderColor: 'var(--fg)',
                boxShadow: '4px 4px 0 0 var(--pink)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = '6px 6px 0 0 var(--pink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = '4px 4px 0 0 var(--pink)'
              }}
            >
              Source Code
            </a>
          </div>

          {/* Code preview */}
          <div
            className="mt-12 max-w-2xl mx-auto text-left border-3 p-6"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--code-bg)',
              boxShadow: '6px 6px 0 0 var(--accent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3" style={{ background: 'var(--pink)' }} />
              <span className="w-3 h-3" style={{ background: 'var(--yellow)' }} />
              <span className="w-3 h-3" style={{ background: 'var(--cyan)' }} />
              <span className="ml-2 text-xs font-mono" style={{ color: 'var(--muted)' }}>main.rs</span>
            </div>
            <pre className="!bg-transparent !border-0 !p-0 !m-0 text-sm">
              <code>
                <span style={{ color: 'var(--accent)' }}>use</span>{' '}
                <span style={{ color: 'var(--cyan)' }}>behest</span>::{'{'}
                <span style={{ color: 'var(--pink)' }}>Agent</span>,{' '}
                <span style={{ color: 'var(--pink)' }}>Tool</span>
                {'}'};{'\n'}
                {'\n'}
                <span style={{ color: 'var(--accent)' }}>let</span> agent ={' '}
                <span style={{ color: 'var(--pink)' }}>Agent</span>::{'\n'}
                {'  '}<span style={{ color: 'var(--muted)' }}>builder</span>(){'\n'}
                {'  '}.<span style={{ color: 'var(--yellow)' }}>provider</span>(
                <span style={{ color: 'var(--cyan)' }}>&quot;openai&quot;</span>){'\n'}
                {'  '}.<span style={{ color: 'var(--yellow)' }}>tool</span>(
                <span style={{ color: 'var(--pink)' }}>WebSearch</span>){'\n'}
                {'  '}.<span style={{ color: 'var(--yellow)' }}>build</span>().{'\n'}
                {'  '}
                <span style={{ color: 'var(--accent)' }}>await</span>?;
              </code>
            </pre>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'TYPE-SAFE',
              desc: 'Leverage Rust\'s type system for compile-time guarantees and runtime safety.',
              color: 'var(--accent)',
              icon: '{}',
            },
            {
              title: 'MODULAR',
              desc: 'Composable building blocks that adapt to your specific use case.',
              color: 'var(--cyan)',
              icon: '[]',
            },
            {
              title: 'PRODUCTION',
              desc: 'Built for real-world AI agent workloads with performance in mind.',
              color: 'var(--pink)',
              icon: '<>',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 border-3 transition-all duration-100 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--surface)',
                boxShadow: `4px 4px 0 0 ${feature.color}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = `6px 6px 0 0 ${feature.color}`
                e.currentTarget.style.borderColor = feature.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = `4px 4px 0 0 ${feature.color}`
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <div
                className="text-2xl font-mono font-bold mb-3"
                style={{ color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-sm font-mono font-bold tracking-widest mb-2"
                style={{ color: feature.color }}
              >
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom decorative bar */}
        <div className="mt-24 flex items-center gap-4">
          <div className="flex-1 h-0.5" style={{ background: 'var(--border-subtle)' }} />
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Built with Rust // Powered by AI
          </span>
          <div className="flex-1 h-0.5" style={{ background: 'var(--border-subtle)' }} />
        </div>
      </main>
    </div>
  )
}
