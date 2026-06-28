/**
 * Documentation file system: recursive walker for `docs/{lang}/**\/*.md`,
 * frontmatter parsing, and slug helpers.
 *
 * The new layout is nested:
 *   docs/en/intro/overview.md      → slug `intro/overview`, URL `/en/docs/intro/overview`
 *   docs/en/core/extension-point.md → slug `core/extension-point`, URL `/en/docs/core/extension-point`
 *
 * A slug is the relative path under `docs/{lang}/` with the `.md` extension
 * removed, using forward slashes as separators.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_ROOT = path.join(process.cwd(), 'docs')
const LANG_ROOT = (lang: string) => path.join(DOCS_ROOT, lang)

export type DocFrontmatter = {
  title?: string
  description?: string
  group?: string
  order?: number
  summary?: string
  related?: string[]
}

export type DocEntry = {
  slug: string
  filePath: string
  frontmatter: DocFrontmatter
}

export type DocWithContent = DocEntry & {
  content: string
}

const EXCLUDED_DIRS = new Set(['_partials', 'assets', 'styles', 'public', 'node_modules'])
const EXCLUDED_FILES = new Set(['README.md'])

function isExcluded(name: string): boolean {
  return EXCLUDED_DIRS.has(name) || EXCLUDED_FILES.has(name)
}

function walk(dir: string, prefix: string, out: DocEntry[]): void {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (isExcluded(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, prefix ? `${prefix}/${entry.name}` : entry.name, out)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const stem = entry.name.slice(0, -3)
      const slug = prefix ? `${prefix}/${stem}` : stem
      let frontmatter: DocFrontmatter = {}
      try {
        const raw = fs.readFileSync(full, 'utf8')
        const parsed = matter(raw)
        frontmatter = (parsed.data ?? {}) as DocFrontmatter
      } catch {
        // ignore frontmatter errors; treat as empty
      }
      out.push({ slug, filePath: full, frontmatter })
    }
  }
}

function listDocs(lang: string): DocEntry[] {
  const root = LANG_ROOT(lang)
  const out: DocEntry[] = []
  walk(root, '', out)
  return out
}

export function getDocBySlug(lang: string, slug: string): DocWithContent {
  const normalized = slug.replace(/^\/+|\/+$/g, '').replace(/\.md$/, '')
  const filePath = path.join(LANG_ROOT(lang), `${normalized}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    slug: normalized,
    filePath,
    frontmatter: (data ?? {}) as DocFrontmatter,
    content,
  }
}

export function docExists(lang: string, slug: string): boolean {
  const normalized = slug.replace(/^\/+|\/+$/g, '').replace(/\.md$/, '')
  const filePath = path.join(LANG_ROOT(lang), `${normalized}.md`)
  try {
    fs.accessSync(filePath, fs.constants.R_OK)
    return true
  } catch {
    return false
  }
}

export function getAllDocs(lang: string): DocWithContent[] {
  return listDocs(lang).map((entry) => {
    const raw = fs.readFileSync(entry.filePath, 'utf8')
    const { data, content } = matter(raw)
    return {
      slug: entry.slug,
      filePath: entry.filePath,
      frontmatter: (data ?? {}) as DocFrontmatter,
      content,
    }
  })
}

export function getAllDocEntries(lang: string): DocEntry[] {
  return listDocs(lang)
}

export function getDocsInGroup(lang: string, group: string): DocEntry[] {
  return listDocs(lang).filter((doc) => {
    const g = doc.frontmatter.group ?? doc.slug.split('/')[0]
    return g === group
  })
}

export function getDocSlugsInGroup(lang: string, group: string): string[] {
  return getDocsInGroup(lang, group).map((d) => d.slug)
}

export type { DocFrontmatter as DocFrontMatter }
