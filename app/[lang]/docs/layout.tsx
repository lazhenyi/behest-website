import { getDictionary, type Locale } from '../dictionaries'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="noise absolute inset-0 pointer-events-none" />
      <Header lang={lang} dict={dict} />
      <div className="flex relative z-10">
        <Sidebar lang={lang} dict={dict} />
        <main className="flex-1 p-8 max-w-4xl mx-auto">
          <div className="prose dark:prose-invert">{children}</div>
        </main>
      </div>
    </div>
  )
}
