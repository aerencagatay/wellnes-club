import { afterEach, describe, expect, it, vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('./rate-limit')
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('checkRateLimit (in-memory geri dönüş)', () => {
  it('Upstash yapılandırılmamışsa in-memory sayaç kullanır', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    const { checkRateLimit, RATE_LIMIT_MAX } = await load()

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect((await checkRateLimit('1.2.3.4')).allowed, `istek ${i + 1}`).toBe(true)
    }
    expect((await checkRateLimit('1.2.3.4')).allowed).toBe(false)
  })

  it('farklı anahtarları bağımsız sayar', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    const { checkRateLimit, RATE_LIMIT_MAX } = await load()
    for (let i = 0; i < RATE_LIMIT_MAX; i++) await checkRateLimit('a')
    expect((await checkRateLimit('a')).allowed).toBe(false)
    expect((await checkRateLimit('b')).allowed).toBe(true)
  })

  it('pencere dolduktan sonra sayaç sıfırlanır', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.useFakeTimers()
    const { checkRateLimit, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } = await load()

    for (let i = 0; i < RATE_LIMIT_MAX; i++) await checkRateLimit('c')
    expect((await checkRateLimit('c')).allowed).toBe(false)

    vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1000)
    expect((await checkRateLimit('c')).allowed).toBe(true)
  })
})
