import { getDocBySlug, getAllDocs } from './docs'

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
  const docs = getAllDocs(lang)
  const title = lang === 'zh' ? '文档目录' : 'Documentation Index'

  lines.push(title)
  lines.push('='.repeat(title.length))
  lines.push('')

  const groups: Record<string, typeof docs> = {
    ...(lang === 'zh'
      ? {
          '快速开始': [],
          '核心概念': [],
          '高级特性': [],
          '开发': [],
        }
      : {
          'Getting Started': [],
          'Core Concepts': [],
          'Advanced': [],
          'Development': [],
        }),
  }

  const groupKeys = Object.keys(groups)

  for (const doc of docs) {
    if (doc.slug === 'index') continue

    let placed = false
    for (const key of groupKeys) {
      const lower = key.toLowerCase()
      if (
        (lower.includes('getting') && ['getting-started', 'examples'].includes(doc.slug)) ||
        (lower.includes('快速') && ['getting-started', 'examples'].includes(doc.slug)) ||
        (lower.includes('core') && ['providers', 'tools', 'sessions', 'storage', 'configuration', 'error-handling'].includes(doc.slug)) ||
        (lower.includes('核心') && ['providers', 'tools', 'sessions', 'storage', 'configuration', 'error-handling'].includes(doc.slug)) ||
        (lower.includes('advanced') && ['architecture', 'rag', 'events', 'features', 'api-reference'].includes(doc.slug)) ||
        (lower.includes('高级') && ['architecture', 'rag', 'events', 'features', 'api-reference'].includes(doc.slug)) ||
        (lower.includes('development') && ['development'].includes(doc.slug)) ||
        (lower.includes('开发') && ['development'].includes(doc.slug))
      ) {
        groups[key].push(doc)
        placed = true
        break
      }
    }
    if (!placed) {
      groups[groupKeys[0]].push(doc)
    }
  }

  if (lang === 'index') {
    const intro = docs.find((d) => d.slug === 'index')
    if (intro) {
      lines.push(intro.content.trim().split('\n').slice(0, 5).join('\n'))
      lines.push('')
    }
  }

  for (const [section, sectionDocs] of Object.entries(groups)) {
    if (sectionDocs.length === 0) continue
    lines.push(`${section}:`)
    for (const doc of sectionDocs) {
      const desc = doc.frontmatter.description
        ? ` - ${doc.frontmatter.description}`
        : ''
      lines.push(`  /${lang}/docs/${doc.slug}${desc}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function renderDoc(lang: string, slug: string): string {
  try {
    const doc = getDocBySlug(lang, slug)
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

    lines.push(doc.content.trim())
    lines.push('')
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
