import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitResult = { success: boolean; remaining: number; reset: number }

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

function toSeconds(ms: number): number {
  return Math.max(1, Math.floor(ms / 1000))
}

function createUpstashLimiter(prefix: string, windowMs: number, max: number) {
  const redis = Redis.fromEnv()
  const limiter = new Ratelimit({
    redis,
    prefix,
    limiter: Ratelimit.slidingWindow(max, `${toSeconds(windowMs)} s`),
  })

  return async (identifier: string): Promise<RateLimitResult> => {
    try {
      const { success, remaining, reset } = await limiter.limit(identifier)
      return { success, remaining, reset }
    } catch {
      return { success: true, remaining: max, reset: Date.now() + windowMs }
    }
  }
}

function createMemoryLimiter(windowMs: number, max: number) {
  const store = new Map<string, { count: number; resetAt: number }>()

  return (identifier: string): RateLimitResult => {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / windowMs)}`
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      return { success: true, remaining: max - 1, reset: now + windowMs }
    }

    entry.count++
    if (entry.count > max) {
      return { success: false, remaining: 0, reset: entry.resetAt }
    }

    return { success: true, remaining: max - entry.count, reset: entry.resetAt }
  }
}

type RateLimitFn = (identifier: string) => Promise<RateLimitResult>

function createLimiter(prefix: string, windowMs: number, max: number): RateLimitFn {
  if (hasUpstash) return createUpstashLimiter(prefix, windowMs, max)
  const mem = createMemoryLimiter(windowMs, max)
  return async (identifier: string) => mem(identifier)
}

export const rateLimiters = {
  ai: createLimiter('ratelimit:ai', 60_000 * 60, 20),
  auth: createLimiter('ratelimit:auth', 60_000, 5),
  mutations: createLimiter('ratelimit:mutations', 60_000, 60),
  api: createLimiter('ratelimit:api', 60_000, 30),
}

export async function checkRateLimit(limiter: RateLimitFn, identifier: string): Promise<void> {
  const result = await limiter(identifier)
  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
    const err = new Error(`Rate limited. Try again in ${retryAfter} seconds.`) as Error & { statusCode: number; retryAfter: number }
    err.statusCode = 429
    err.retryAfter = retryAfter
    throw err
  }
}
