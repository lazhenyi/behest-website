import type { NextRequest } from 'next/server'
import { renderText } from '../../../lib/render-text'

type Context = {
  params: Promise<{
    path?: string[]
  }>
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: Context) {
  const { path = [] } = await context.params
  const pathname = `/${path.join('/')}`

  const body = await renderText(pathname, request.nextUrl.searchParams)

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'Vary': 'Accept, User-Agent',
    },
  })
}
