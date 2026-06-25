import { NextResponse, type NextRequest } from 'next/server'
import { wantsPlainText } from './lib/request-format'

const TEXT_ROUTE_PREFIX = '/text'

export function middleware(request: NextRequest) {
  if (!wantsPlainText(request)) {
    const response = NextResponse.next()
    response.headers.set('Vary', 'Accept, User-Agent')
    return response
  }

  const url = request.nextUrl.clone()
  const pathname = url.pathname === '/' ? '' : url.pathname

  url.pathname = `${TEXT_ROUTE_PREFIX}${pathname}`

  const response = NextResponse.rewrite(url)
  response.headers.set('Vary', 'Accept, User-Agent')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|api|text).*)',
  ],
}
