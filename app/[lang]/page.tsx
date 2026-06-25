import { type Locale } from '@/app/[lang]/dictionaries'
import HomePage from '@/components/HomePage'

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  return <HomePage lang={lang} />
}
