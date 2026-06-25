import type { NextRequest } from 'next/server'

const TEXT_USER_AGENT =
  /\b(curl|wget|httpie|python-requests|aiohttp|go-http-client|node-fetch|undici|axios|postmanruntime|insomnia|bot|crawler|spider)\b/i

const BROWSER_USER_AGENT =
  /\b(mozilla|chrome|safari|firefox|edg|opr)\b/i

export function wantsPlainText(request: NextRequest): boolean {
  const url = request.nextUrl
  const format = url.searchParams.get('format')

  if (format === 'text' || format === 'txt') {
    return true
  }

  if (format === 'html') {
    return false
  }

  const accept = request.headers.get('accept') ?? ''
  const userAgent = request.headers.get('user-agent') ?? ''

  if (accept.includes('text/plain') && !accept.includes('text/html')) {
    return true
  }

  if (TEXT_USER_AGENT.test(userAgent)) {
    return true
  }

  if (accept.includes('text/html')) {
    return false
  }

  return !BROWSER_USER_AGENT.test(userAgent)
}
