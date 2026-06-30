import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DEMO_COOKIE } from '@/lib/demo'

const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/demo']

const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://avatars.githubusercontent.com https://lh3.googleusercontent.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const isDemo = request.cookies.get(DEMO_COOKIE)?.value === 'true'
  const localUserId = request.cookies.get('local_user_id')?.value
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isDemo || localUserId) {
    return supabaseResponse
  }

  if (!hasSupabase && !isDemo && !localUserId) {
    const pathname = request.nextUrl.pathname
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/') || pathname.startsWith('/_next/'))
    if (!isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      supabaseResponse.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())
      return NextResponse.redirect(url)
    }
    supabaseResponse.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())
    return supabaseResponse
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
          supabaseResponse = NextResponse.next({ request })
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
    return NextResponse.redirect(url)
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  supabaseResponse.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
