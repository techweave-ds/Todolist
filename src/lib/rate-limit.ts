type RateLimitFn = (identifier: string) => { success: boolean; remaining: number; reset: number }

interface RateLimitConfig {
  window: number
  max: number
}

const stores = new Map<string, Map<string, { count: number; resetAt: number }>>()

function createStore(config: RateLimitConfig): RateLimitFn {
  const store = new Map<string, { count: number; resetAt: number }>()
  const storeKey = `ratelimit:${config.window}:${config.max}`
  stores.set(storeKey, store)

  return (identifier: string) => {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / config.window)}`
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + config.window })
      stores.forEach((s, k) => { if (k !== storeKey) s.clear() })
      return { success: true, remaining: config.max - 1, reset: now + config.window }
    }

    entry.count++
    if (entry.count > config.max) {
      return { success: false, remaining: 0, reset: entry.resetAt }
    }

    return { success: true, remaining: config.max - entry.count, reset: entry.resetAt }
  }
}

export const rateLimiters = {
  ai: createStore({ window: 60_000 * 60, max: 20 }),
  auth: createStore({ window: 60_000, max: 5 }),
  mutations: createStore({ window: 60_000, max: 60 }),
  api: createStore({ window: 60_000, max: 30 }),
}

export function checkRateLimit(limiter: RateLimitFn, identifier: string): void {
  const result = limiter(identifier)
  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
    const err = new Error(`Rate limited. Try again in ${retryAfter} seconds.`)
    ;(err as any).statusCode = 429
    ;(err as any).retryAfter = retryAfter
    throw err
  }
}
