/**
 * remark plugin: turns ```mermaid fenced code blocks into raw HTML
 * `<pre class="mermaid" data-source="…">` markers that the client-side
 * `<MermaidClient />` component picks up and renders with mermaid.
 *
 * Why not render server-side?
 *   mermaid's render API needs a DOM (JSDOM) in Node, which adds a
 *   heavy dependency. Marking the source and rendering in the browser
 *   keeps the server payload small and avoids the JSDOM install.
 *
 * Trade-off: diagrams require JS. Without JS, the user sees the raw
 * mermaid source — still legible, and copy-pastable.
 */

import { visit } from 'unist-util-visit'
import type { Root, Code } from 'mdast'
import type { Plugin } from 'unified'

const escapeAttr = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const remarkMermaid: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, 'code', (node: Code) => {
    if (node.lang !== 'mermaid') return
    const source = node.value
    const data = (node.data ?? (node.data = {})) as { hName?: string; hProperties?: Record<string, unknown> }
    data.hName = 'pre'
    data.hProperties = {
      className: ['mermaid'],
      'data-source': source,
    }
    // Replace the text child with a single empty placeholder so that
    // rehype-stringify doesn't double-encode the source. The `data-source`
    // attribute carries the diagram; the rendered output is empty text.
    node.value = ''
    // Force a raw-HTML passthrough via the alternate hChildren channel.
    // We use the simpler "replace the value with the escaped HTML" trick.
    node.value = ''
    // Switch the node to raw HTML so rehype-raw re-parses it.
    ;(node as unknown as { type: string }).type = 'html'
    ;(node as unknown as { value: string }).value = `<pre class="mermaid" data-source="${escapeAttr(
      source,
    )}"></pre>`
  })
}
