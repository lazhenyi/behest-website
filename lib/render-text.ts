import { getDocBySlug, getAllDocs } from './docs'
import { markdownToHtml, htmlToText } from './markdown'
import { nav, type NavGroup } from './nav'

interface RenderOptions {
  lang?: string
}

function resolveLang(pathname: string): string {
  if (pathname.startsWith('/zh')) return 'zh'
  return 'en'
}

function stripLang(pathname: string): string {
  return pathname.replace(/^\/(en|zh)/, '') || '/'
}

function renderLanding(lang: string): string {
  const lines: string[] = []

  lines.push('behest')
  lines.push('=====')
  lines.push('')
  lines.push('Rust-native building blocks for production AI agent runtimes.')
  lines.push('')

  if (lang === 'zh') {
    lines.push('链接:')
    lines.push('  /en/docs          - 文档')
    lines.push('  /zh/docs          - 文档 (中文)')
    lines.push('  https://github.com/lazhenyi/behest - 源码')
    lines.push('')
    lines.push('特性:')
    lines.push('  - 类型安全 — Rust 类型系统编译期保证')
    lines.push('  - 模块化   — 可组合的构建块')
    lines.push('  - 生产就绪 — 面向真实 AI Agent 工作负载')
  } else {
    lines.push('Links:')
    lines.push('  /en/docs          - Documentation')
    lines.push('  /zh/docs          - 文档 (Chinese)')
    lines.push('  https://github.com/lazhenyi/behest - Source')
    lines.push('')
    lines.push('Features:')
    lines.push('  - Type-Safe  — Rust compile-time guarantees')
    lines.push('  - Modular    — Composable building blocks')
    lines.push('  - Production — Built for real AI agent workloads')
  }

  lines.push('')
  lines.push(`Force text:  ?format=text`)
  lines.push(`Force HTML:  ?format=html`)

  return lines.join('\n')
}

function renderDocsIndex(lang: string): string {
  const lines: string[] = []
  const title = lang === 'zh' ? '文档目录' : 'Documentation Index'

  lines.push(title)
  lines.push('='.repeat(title.length))
  lines.push('')

  for (const group of nav) {
    const headerLabel = lang === 'zh' ? zhGroupTitle(group.id) : enGroupTitle(group.id)
    lines.push(`${headerLabel}  (/${lang}/docs/${group.landing})`)
    lines.push('-'.repeat(headerLabel.length + 4))
    for (const item of group.items) {
      const itemLabel = lang === 'zh' ? zhPageLabel(item.titleKey) : enPageLabel(item.titleKey)
      lines.push(`  /${lang}/docs/${item.slug}  ${itemLabel}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function enGroupTitle(id: NavGroup['id']): string {
  const map: Record<NavGroup['id'], string> = {
    intro: 'Introduction',
    core: 'Core Abstractions',
    runtime: 'Agent Runtime',
    events: 'Invocation & Events',
    tools: 'Context & Tools',
    providers: 'Providers',
    storage: 'Storage',
    config: 'Config & Cross-cutting',
    ops: 'Operations',
    ref: 'Reference & Help',
  }
  return map[id] ?? id
}

function zhGroupTitle(id: NavGroup['id']): string {
  const map: Record<NavGroup['id'], string> = {
    intro: '入门',
    core: '核心抽象',
    runtime: 'Agent 运行时',
    events: '调用与事件',
    tools: '上下文与工具',
    providers: 'Provider',
    storage: '存储',
    config: '配置与横切关注点',
    ops: '运维',
    ref: '参考与帮助',
  }
  return map[id] ?? id
}

function enPageLabel(titleKey: string): string {
  if (!titleKey.startsWith('nav.pages.')) return titleKey
  return titleKey.slice('nav.pages.'.length)
}

function zhPageLabel(titleKey: string): string {
  return enPageLabel(titleKey)
}

async function renderDoc(lang: string, slug: string): Promise<string> {
  try {
    const doc = getDocBySlug(lang, slug)
    const { html, headings } = await markdownToHtml(doc.content)
    const lines: string[] = []

    if (doc.frontmatter.title) {
      lines.push(doc.frontmatter.title)
      lines.push('='.repeat(doc.frontmatter.title.length))
      lines.push('')
    }

    if (doc.frontmatter.description) {
      lines.push(doc.frontmatter.description)
      lines.push('')
      lines.push('---')
      lines.push('')
    }

    lines.push(htmlToText(html))
    lines.push('')

    if (headings.length > 0) {
      lines.push('---')
      lines.push('Outline:')
      for (const h of headings) {
        lines.push(`  ${'  '.repeat(h.depth - 2)}${h.value}`)
      }
      lines.push('')
    }

    lines.push('---')
    lines.push(`[HTML]  /${lang}/docs/${slug}?format=html`)
    lines.push(`[Index] /${lang}/docs`)

    return lines.join('\n')
  } catch {
    return [
      'Not Found',
      '',
      `No document found: /${lang}/docs/${slug}`,
      '',
      `Index: /${lang}/docs`,
    ].join('\n')
  }
}

export async function renderText(
  pathname: string,
  _searchParams: URLSearchParams,
): Promise<string> {
  const lang = resolveLang(pathname)
  const stripped = stripLang(pathname)

  if (stripped === '/' || stripped === '') {
    return renderLanding(lang)
  }

  if (stripped === '/docs' || stripped === '/docs/') {
    return renderDocsIndex(lang)
  }

  if (stripped.startsWith('/docs/')) {
    const slug = stripped.replace('/docs/', '').replace(/\/$/, '')
    if (slug) {
      return renderDoc(lang, slug)
    }
    return renderDocsIndex(lang)
  }

  return [
    'Not Found',
    '',
    `Path: ${pathname}`,
    '',
    `Index: /${lang}/docs`,
  ].join('\n')
}
