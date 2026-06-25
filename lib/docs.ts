import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const docsDirectory = path.join(process.cwd(), 'docs')

export function getDocBySlug(lang: string, slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(docsDirectory, lang, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: realSlug,
    frontmatter: data,
    content,
  }
}

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown)
  return result.toString()
}

export function getAllDocs(lang: string) {
  const docsDir = path.join(docsDirectory, lang)
  const slugs = fs.readdirSync(docsDir).filter((file) => file.endsWith('.md'))

  return slugs.map((slug) => {
    const doc = getDocBySlug(lang, slug.replace(/\.md$/, ''))
    return {
      ...doc,
      slug: slug.replace(/\.md$/, ''),
    }
  })
}
