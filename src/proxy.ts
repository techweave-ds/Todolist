import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DEMO_COOKIE, SESSION_COOKIE } from '@/lib/demo'

const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/demo']

const isDev = process.env.NODE_ENV === 'development'

function buildCsp(nonce: string): string {
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}'`

  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
    : null
  const connectSources = [
    "'self'",
    supabaseHost ? `https://${supabaseHost}` : null,
    isDev ? 'ws://localhost:*' : null,
  ].filter(Boolean).join(' ')

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
    "font-src 'self'",
    `connect-src ${connectSources}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'block-all-mixed-content',
    'upgrade-insecure-requests',
  ].join('; ')
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const nonce = crypto.randomUUID()

  const isDemo = request.cookies.get(DEMO_COOKIE)?.value === 'true'
  const hasSession = !!request.cookies.get(SESSION_COOKIE)?.value
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  const applyCsp = (res: NextResponse) => {
    res.headers.set('Content-Security-Policy', buildCsp(nonce))
    return res
  }

  if (isDemo || hasSession) {
    return applyCsp(supabaseResponse)
  }

  if (!hasSupabase && !isDemo && !hasSession) {
    const pathname = request.nextUrl.pathname
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/') || pathname.startsWith('/_next/'))
    if (!isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return applyCsp(NextResponse.redirect(url))
    }
    return applyCsp(supabaseResponse)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/') || pathname.startsWith('/_next/'))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return applyCsp(NextResponse.redirect(url))
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return applyCsp(NextResponse.redirect(url))
  }

  return applyCsp(supabaseResponse)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
