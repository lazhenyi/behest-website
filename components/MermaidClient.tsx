'use client'

import { useEffect, useState } from 'react'

/**
 * Client-side Mermaid renderer.
 *
 * Finds every `<pre class="mermaid" data-source="…">` produced by the
 * server-side remark pipeline and calls `mermaid.render()` on each one,
 * replacing the placeholder with the rendered SVG.
 *
 * Failures are surfaced as styled error placeholders so a broken diagram
 * never breaks the rest of the page.
 */
export default function MermaidClient() {
  const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle')

  useEffect(() => {
    let cancelled = false

    const blocks = Array.from(
      document.querySelectorAll<HTMLPreElement>('pre.mermaid[data-source]'),
    )
    if (blocks.length === 0) return

    setStatus('rendering')

    ;(async () => {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            background: '#0A0A0A',
            primaryColor: '#1A1A1A',
            primaryTextColor: '#E2E8F0',
            primaryBorderColor: '#7C3AED',
            lineColor: '#06B6D4',
            secondaryColor: '#1A1A1A',
            tertiaryColor: '#111111',
            fontFamily: 'Space Mono, ui-monospace, monospace',
            fontSize: '14px',
          },
          flowchart: { curve: 'basis', padding: 12 },
          sequence: { actorMargin: 60, messageMargin: 40, boxMargin: 12 },
          securityLevel: 'strict',
        })

        for (let i = 0; i < blocks.length; i++) {
          if (cancelled) return
          const block = blocks[i]
          const source = block.dataset.source ?? ''
          if (!source.trim()) continue
          const id = `mmd-${Date.now()}-${i}`
          try {
            const { svg } = await mermaid.render(id, source)
            if (cancelled) return
            const wrapper = document.createElement('div')
            wrapper.className = 'mermaid-rendered'
            wrapper.innerHTML = svg
            block.replaceWith(wrapper)
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            const pre = document.createElement('pre')
            pre.className = 'mermaid-error'
            pre.textContent = `Mermaid render error:\n${message}\n\nSource:\n${source}`
            block.replaceWith(pre)
          }
        }

        if (!cancelled) setStatus('done')
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Mermaid client failed to load', err)
          setStatus('error')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'error') {
    return (
      <p
        style={{
          position: 'fixed',
          bottom: 8,
          right: 8,
          padding: '4px 8px',
          background: 'var(--pink)',
          color: '#fff',
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          zIndex: 9999,
        }}
      >
        mermaid: load failed
      </p>
    )
  }

  return null
}
