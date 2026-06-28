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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header lang={lang} dict={dict} />
      <div className="flex">
        <Sidebar lang={lang} dict={dict} />
        <main className="flex-1 min-w-0 p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
