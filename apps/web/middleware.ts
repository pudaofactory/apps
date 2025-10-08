import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"'
    }
  })
}

function decodeBase64(value: string) {
  const sanitized = value.replace(/-/g, '+').replace(/_/g, '/')
  const decoded = atob(sanitized)
  const bytes = Uint8Array.from(decoded, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.next()
  }

  const basicAuth = process.env.BASIC_AUTH
  if (!basicAuth) {
    return NextResponse.next()
  }

  const header = req.headers.get('authorization')
  if (!header?.startsWith('Basic ')) {
    return unauthorized()
  }

  const base64Credentials = header.split(' ')[1] ?? ''
  const credentials = decodeBase64(base64Credentials)

  if (credentials !== basicAuth) {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
