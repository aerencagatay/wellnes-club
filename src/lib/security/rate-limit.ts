export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function inMemoryCheck(key: string): { allowed: boolean } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (bucket.count >= RATE_LIMIT_MAX) return { allowed: false }
  bucket.count += 1
  return { allowed: true }
}

/**
 * Upstash yapılandırılmışsa dağıtık, değilse süreç içi sayaç kullanır.
 * Süreç içi sayaç sunucusuz ortamda örnekler arasında paylaşılmaz — bu bilinçli
 * bir ödünç: yapılandırma eksikken form çalışmaya devam eder. Sunucusuz platformlarda
 * her örnek kendi sayacını tutacağı için sınır teorik olarak N kat gevşer; bunu
 * "düzeltmek" isteyen biri Upstash'i zorunlu kılarsa, yapılandırma eksikken talep
 * formu tamamen kilitlenir — bu değişim kabul edilemez, bu yüzden geri dönüş kalıcıdır.
 */
export async function checkRateLimit(key: string): Promise<{ allowed: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return inMemoryCheck(key)

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    const limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, '10 m'),
      prefix: 'serenity:inquiry',
    })
    const { success } = await limiter.limit(key)
    return { allowed: success }
  } catch {
    // Upstash erişilemezse formu kilitlemek yerine süreç içi sayaca düş.
    return inMemoryCheck(key)
  }
}
