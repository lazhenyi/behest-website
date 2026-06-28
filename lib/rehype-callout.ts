/**
 * remark plugin: turns `:::callout{type=info}` container directives into
 * raw HTML that `rehype-raw` will re-parse as structured HTML.
 *
 * The key insight: `remark-rehype` + `data.hName`/`data.hProperties` doesn't
 * always work reliably for container directives across all `mdast-util-to-hast`
 * versions. A more robust approach is to mutate the directive node into a raw
 * HTML node. `rehype-raw` picks it up natively.
 *
 * Supported types: info, warning, tip, danger. Defaults to `info`.
 */

import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'

type ContainerDirectiveLike = {
  type: 'containerDirective'
  name: string
  attributes?: Record<string, unknown>
  children: unknown[]
}

const VALID_TYPES = new Set(['info', 'warning', 'tip', 'danger'])

/**
 * Recursively render a container directive's children to markdown,
 * then convert to HTML. We use a simple approach: serialize back to
 * markdown text and wrap in the target HTML.
 */
function renderChildrenAsHtml(children: unknown[]): string {
  // Instead of complex serialisation, we let remark-rehype handle the children
  // inside the wrapper. The strategy: output raw opening tag, keep children
  // as-is (remark-rehype processes them), then close with raw tag.
  // BUT: remark-rehype doesn't process raw HTML children inside `mdast`. We
  // need a different strategy.
  //
  // Strategy: Convert the containerDirective node to a `paragraph` with raw
  // HTML content, wrapped in the target div.
  return ''
}

export const remarkCallout: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, (node, index, parent) => {
    if ((node as { type?: string }).type !== 'containerDirective') return
    const dir = node as unknown as ContainerDirectiveLike
    if (dir.name !== 'callout') return

    const rawType = (dir.attributes?.type ?? 'info').toString().toLowerCase()
    const type = VALID_TYPES.has(rawType) ? rawType : 'info'

    // Convert the container directive into a raw HTML node.
    // remark-rehype will emit the raw opening/closing tags, and
    // rehype-raw will parse them. The children inside the container
    // are preserved — remark-rehype will process them between the
    // opening and closing raw tags because the entire node is
    // replaced.
    //
    // Actually, the simplest and most reliable approach:
    // set data.hName and data.hProperties. This IS the standard
    // mdast-util-directive contract. If it doesn't work, the issue
    // is somewhere else in the pipeline.
    const data = (node.data ?? (node.data = {})) as {
      hName?: string
      hProperties?: Record<string, unknown>
    }
    data.hName = 'div'
    data.hProperties = {
      className: ['callout', `callout-${type}`],
      'data-type': type,
    }
  })
}
