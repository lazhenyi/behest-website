'use client'

import { useEffect, useState } from 'react'

type Heading = { depth: 2 | 3; value: string; id: string }

type Props = {
  headings: Heading[]
}

/**
 * Right-side table of contents. Server-rendered base, client-enhanced
 * with active-section highlighting via IntersectionObserver.
 *
 * Hidden below `lg` breakpoint to keep the article column readable.
 */
export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1],
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside
      className="hidden lg:block w-56 shrink-0"
      style={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}
      aria-label="On this page"
    >
      <div
        className="p-4"
        style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          boxShadow: 'var(--clay-shadow-sm)',
        }}
      >
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-2"
          style={{
            color: 'var(--sage)',
            borderBottom: '2px solid var(--border-subtle)',
          }}
        >
          On this page
        </p>
        <ul className="space-y-0.5 text-sm">
          {headings.map((h) => {
            const isActive = h.id === activeId
            return (
              <li
                key={h.id}
                style={{ paddingLeft: h.depth === 3 ? 12 : 0 }}
              >
                <a
                  href={`#${h.id}`}
                  className="block py-1.5 px-3 transition-all duration-200"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {h.value}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
