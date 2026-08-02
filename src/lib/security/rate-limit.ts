export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
/** Süreç içi haritanın en kötü durumda büyüyebileceği üst sınır — bkz. aşağıdaki not. */
const MAX_TRACKED_KEYS = 5000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

/** Süresi dolmuş kovaları haritadan temizler; yalnızca kendi anahtarı yeniden
 * sorgulanan kovalar "dokunulmuş" sayılır, bu yüzden her çağrıda tüm harita taranır. */
function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

function inMemoryCheck(key: string): { allowed: boolean } {
  const now = Date.now()
  sweepExpired(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    // Süpürmeden sonra bile harita üst sınırdaysa (ör. aktif pencerede çok sayıda
    // benzersiz anahtar), en eski girdileri atarak büyümeyi sınırlı tut. Map ekleme
    // sırasını korur, bu yüzden ilk anahtar her zaman en eskisidir.
    while (buckets.size >= MAX_TRACKED_KEYS) {
      const oldestKey = buckets.keys().next().value
      if (oldestKey === undefined) break
      buckets.delete(oldestKey)
    }
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (bucket.count >= RATE_LIMIT_MAX) return { allowed: false }
  bucket.count += 1
  return { allowed: true }
}

/** Yalnızca testler için: süreç içi sayaç haritasını sıfırlar. Üretim kodu bunu çağırmaz. */
export function resetRateLimitStateForTests(): void {
  buckets.clear()
}

/**
 * Upstash yapılandırılmışsa dağıtık, değilse süreç içi sayaç kullanır.
 * Süreç içi sayaç sunucusuz ortamda örnekler arasında paylaşılmaz — bu bilinçli
 * bir ödünç: yapılandırma eksikken form çalışmaya devam eder. Sunucusuz platformlarda
 * her örnek kendi sayacını tutacağı için sınır teorik olarak N kat gevşer; bunu
 * "düzeltmek" isteyen biri Upstash'i zorunlu kılarsa, yapılandırma eksikken talep
 * formu tamamen kilitlenir — bu değişim kabul edilemez, bu yüzden geri dönüş kalıcıdır.
 *
 * Aynı ödünç, tek bir sürecin ÖMRÜ boyunca haritanın büyümesi için de geçerli: bir
 * anahtar yalnızca yeniden sorgulandığında "dokunulur" ve süresi dolmuş kovası
 * silinebilir; hiç geri dönmeyen anahtarlar (ör. bir kerelik ziyaretçiler, ya da
 * `clientIp()` düzeltilmeden önceki gibi anahtar başına sahte IP saldırıları)
 * teorik olarak süresiz birikir. Bunu her çağrıda opportunistic bir süpürme
 * (`sweepExpired`) ve sert bir üst sınırla (`MAX_TRACKED_KEYS`, en eski anahtarları
 * atarak) sınırlıyoruz — yine de kilitlemek yerine gevşemeyi tercih eden aynı felsefe.
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
