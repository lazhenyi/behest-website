interface JsonLdProps {
  type: 'website' | 'article' | 'software'
  title?: string
  description?: string
  url?: string
  datePublished?: string
  dateModified?: string
  author?: string
}

export default function JsonLd({
  type,
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
}: JsonLdProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
  }

  if (type === 'website') {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...baseSchema,
            '@type': 'WebSite',
            name: 'behest',
            url: 'https://behest.dev',
            description: 'Rust-native building blocks for production AI agent runtimes',
            publisher: {
              '@type': 'Organization',
              name: 'behest',
              url: 'https://behest.dev',
            },
          }),
        }}
      />
    )
  }

  if (type === 'software') {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...baseSchema,
            '@type': 'SoftwareSourceCode',
            name: 'behest',
            description: 'Rust-native building blocks for production AI agent runtimes',
            url: 'https://behest.dev',
            codeRepository: 'https://github.com/lazhenyi/behest',
            programmingLanguage: 'Rust',
            license: 'https://opensource.org/licenses/MIT',
            author: {
              '@type': 'Person',
              name: 'lazhenyi',
              url: 'https://github.com/lazhenyi',
            },
          }),
        }}
      />
    )
  }

  if (type === 'article' && title && url) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...baseSchema,
            '@type': 'TechArticle',
            headline: title,
            description: description || '',
            url,
            datePublished: datePublished || new Date().toISOString(),
            dateModified: dateModified || new Date().toISOString(),
            author: {
              '@type': 'Person',
              name: author || 'lazhenyi',
              url: 'https://github.com/lazhenyi',
            },
            publisher: {
              '@type': 'Organization',
              name: 'behest',
              url: 'https://behest.dev',
            },
          }),
        }}
      />
    )
  }

  return null
}
