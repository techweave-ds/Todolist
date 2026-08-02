import { createHash, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { DEMO_COOKIE, DEMO_USER_ID, SESSION_COOKIE } from '@/lib/demo'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days
const BCRYPT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  }
}

export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken()
  const tokenHash = sha256(token)
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || null
  const userAgent = h.get('user-agent') || null

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      ipAddress: ip,
      userAgent,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions())
}

export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const cookieStore = await cookies()

  const isDemo = cookieStore.get(DEMO_COOKIE)?.value === 'true'
  if (isDemo) {
    return { id: DEMO_USER_ID, email: 'demo@mission-os.local' }
  }

  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = sha256(token)
  const session = await prisma.session.findUnique({ where: { tokenHash }, include: { user: true } })
  if (!session) return null

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  return { id: session.user.id, email: session.user.email }
}

export async function getAuthUserId(): Promise<string> {
  const sessionUser = await getSessionUser()
  if (sessionUser) return sessionUser.id

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Unauthorized — no session found. Please log in or create an account.')
  }

  const { createSupabaseServerClient } = await import('@/lib/supabase-server')
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user.id
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    const tokenHash = sha256(token)
    await prisma.session.deleteMany({ where: { tokenHash } })
  }
  cookieStore.delete(SESSION_COOKIE)
  cookieStore.delete(DEMO_COOKIE)
}

export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } })
}
