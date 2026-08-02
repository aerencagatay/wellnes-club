import { beforeEach, describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { resetRateLimitStateForTests } from '@/lib/security/rate-limit'
import { POST } from './route'

const ENDPOINT = 'http://localhost/api/inquiry'
const CAMP_SLUG = getAllCamps()[0].slug

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const validCamp = {
  kind: 'camp' as const,
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+905551112233',
  campSlug: CAMP_SLUG,
  guests: 2,
  roomPreference: 'paylasimli' as const,
  consent: true as const,
}

beforeEach(() => {
  // Süreç içi sayaç testler arasında paylaşılan modül durumudur (bkz. rate-limit.ts) —
  // her testin kendi IP anahtarını taze bir sayaçla görmesi için sıfırlanır.
  resetRateLimitStateForTests()
})

describe('POST /api/inquiry', () => {
  it('geçerli camp gövdesi → 200 ve referenceId biçimi doğru', async () => {
    const res = await POST(makeRequest(validCamp, { 'x-forwarded-for': '101.1.1.1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.referenceId).toMatch(/^SR-\d{8}-[A-Z2-7]{4}$/)
  })

  it('geçersiz alan → 400 ve beklenen hata anahtarı', async () => {
    const res = await POST(
      makeRequest({ ...validCamp, email: 'bozuk' }, { 'x-forwarded-for': '101.1.1.2' }),
    )
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toEqual({ ok: false, errors: { email: 'invalidEmail' } })
  })

  it('bozuk JSON gövdesi → 400 { form: generic }', async () => {
    const res = await POST(makeRequest('bu-json-degil', { 'x-forwarded-for': '101.1.1.3' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toEqual({ ok: false, errors: { form: 'generic' } })
  })

  it('bir IP\'den altıncı istek → 429 { error: rate_limited }', async () => {
    const ip = '101.1.1.4'
    for (let i = 0; i < 5; i++) {
      const res = await POST(
        makeRequest({ kind: 'newsletter', email: 'a@b.com', consent: true }, { 'x-forwarded-for': ip }),
      )
      expect(res.status, `istek ${i + 1}`).toBe(200)
    }
    const res = await POST(
      makeRequest({ kind: 'newsletter', email: 'a@b.com', consent: true }, { 'x-forwarded-for': ip }),
    )
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json).toEqual({ ok: false, error: 'rate_limited' })
  })

  it('sahte x-forwarded-for zinciri: aynı asıl istemciden gelen 6 istek yine 429 döner', async () => {
    // X-Forwarded-For eklemeli bir zincirdir: her proxy KENDİ gördüğü eşi zincirin
    // sonuna ekler. Zincirin İLK halkası bağlanan istemcinin İDDİA ettiği değerdir —
    // güvenilir bir ara katman yoksa saldırgan bunu serbestçe değiştirebilir. Burada
    // "güvenilir bir yakın proxy"nin her istekte aynı gerçek eşi (9.9.9.9) zincirin
    // SONUNA eklediğini, ama saldırganın kendi iddia ettiği ilk halkayı her istekte
    // değiştirdiğini simüle ediyoruz. clientIp() ilk halkaya güvenirse her istek yeni
    // bir kova alır ve sınır asla dolmaz; son halkaya bakarsa hepsi aynı kovaya düşer.
    const trustedHop = '9.9.9.9'
    const claimedByClient = ['1.1.1.1', '2.2.2.2', '3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6']

    const statuses: number[] = []
    for (const claimed of claimedByClient) {
      const res = await POST(
        makeRequest(
          { kind: 'newsletter', email: 'spoof@example.com', consent: true },
          { 'x-forwarded-for': `${claimed}, ${trustedHop}` },
        ),
      )
      statuses.push(res.status)
    }

    expect(statuses.slice(0, 5), JSON.stringify(statuses)).toEqual([200, 200, 200, 200, 200])
    expect(statuses[5], JSON.stringify(statuses)).toBe(429)
  })
})
