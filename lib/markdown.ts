/**
 * Markdown → HTML pipeline for documentation pages.
 *
 * Pipeline (server-side, no client JS required for basic rendering):
 *   1. remark-parse       — markdown → mdast
 *   2. remark-gfm         — GFM tables, strikethrough, autolinks
 *   3. remark-directive   — recognise `:::callout`, `:::tabs`, etc.
 *   4. remark-rehype      — mdast → hast (raw HTML allowed)
 *   5. rehype-raw         — re-parse raw HTML in markdown
 *   6. rehype-callout     — turn directive nodes into <aside> elements
 *   7. rehype-mermaid     — mark ```mermaid blocks for client-side render
 *   8. rehype-slug        — add id="" to headings
 *   9. rehype-extract-toc — side-effect: collect H2/H3 to out-array
 *  10. rehype-stringify   — hast → HTML
 *
 * The Mermaid SVG is rendered client-side by `<MermaidClient />`.
 * Callout directives are rendered as styled `<aside>` HTML.
 */

import { unified, type Plugin } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import type { Root, Element, Text } from 'hast'
import type { Plugin as UnifiedPlugin } from 'unified'

import { remarkCallout } from './rehype-callout'
import { remarkMermaid } from './rehype-mermaid'

export type Heading = { depth: 2 | 3; value: string; id: string }

/**
 * rehype plugin: walks the HAST tree, pushes H2/H3 headings to `out`.
 * Uses github-slugger to dedupe ids and mirror rehype-slug's behaviour.
 */
function rehypeExtractToc(out: Heading[]): UnifiedPlugin<[], Root> {
  const slugger = new GithubSlugger()
  return () => (tree: Root) => {
    slugger.reset()
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return
      const text = collectText(node).trim()
      if (!text) return
      const existing = (node.properties?.id ?? '') as string | string[]
      const id = (Array.isArray(existing) ? existing[0] : existing) || slugger.slug(text)
      node.properties = { ...(node.properties ?? {}), id }
      out.push({
        depth: node.tagName === 'h2' ? 2 : 3,
        value: text,
        id,
      })
    })
  }
}

function collectText(node: Element): string {
  let out = ''
  for (const child of node.children) {
    if (child.type === 'text') out += (child as Text).value
    else if (child.type === 'element') out += collectText(child as Element)
  }
  return out
}

/**
 * rehype-callout: converts <div class="callout" data-type="info">…</div>
 * produced by remark-callout into <aside class="callout callout-info">.
 * (remark-callout already emits a stable <div> shape; this rewriter
 * rebrands it to <aside> and normalises the class names.)
 */
const remarkCalloutRehype: UnifiedPlugin<[], Root> = () => (tree: Root) => {
  visit(tree, 'element', (node: Element) => {
    if (
      node.tagName === 'div' &&
      Array.isArray(node.properties?.className) &&
      (node.properties.className as string[]).includes('callout')
    ) {
      node.tagName = 'aside'
    }
  })
}

export type MarkdownResult = {
  html: string
  headings: Heading[]
}

/**
 * Convert raw markdown to HTML and extract the heading outline.
 *
 * @param markdown  raw markdown source
 * @returns          `{ html, headings }` — html is the rendered body,
 *                   headings is the H2/H3 outline with stable ids
 */
export async function markdownToHtml(markdown: string): Promise<MarkdownResult> {
  const headings: Heading[] = []
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkCallout)
    .use(remarkMermaid)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(remarkCalloutRehype)
    .use(rehypeSlug)
    .use(rehypeExtractToc(headings))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return {
    html: String(file),
    headings,
  }
}

/**
 * Strip HTML and produce a plaintext rendering.
 * Used by the `/text/...` route for curl users.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<\/?(aside|div|section|article|header|footer|nav|main)[^>]*>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?(p|h[1-6]|li|tr|blockquote|pre)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Re-export types so consumers don't need to know internal paths.
export type {}
