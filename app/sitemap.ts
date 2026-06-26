import type { MetadataRoute } from 'next'
import { getAllDocs } from '@/lib/docs'
import { i18n } from '@/app/[lang]/dictionaries'

const BASE_URL = 'https://behest.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage for each locale
  for (const lang of i18n.locales) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })
  }

  // Docs index for each locale
  for (const lang of i18n.locales) {
    entries.push({
      url: `${BASE_URL}/${lang}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Individual doc pages
  for (const lang of i18n.locales) {
    try {
      const docs = getAllDocs(lang)
      for (const doc of docs) {
        if (doc.slug === 'index') continue // Already covered by docs index
        entries.push({
          url: `${BASE_URL}/${lang}/docs/${doc.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    } catch {
      // Skip if docs directory doesn't exist for this locale
    }
  }

  return entries
}
