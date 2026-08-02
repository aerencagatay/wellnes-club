import { afterEach, describe, expect, it, vi } from 'vitest'
import type { InquiryInput } from '@/lib/utils/validation'
import { resolveErrorMessage, submitInquiry } from './inquiry-client'

const validNewsletter: InquiryInput = { kind: 'newsletter', email: 'a@b.com', consent: true }

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('submitInquiry', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('200 { ok: true } → referenceId ile birlikte olduğu gibi döner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: true, referenceId: 'SR-1' }, 200)))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: true, referenceId: 'SR-1' })
  })

  it('400 { ok: false, errors } → alan hatalarını olduğu gibi döner', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ ok: false, errors: { email: 'invalidEmail' } }, 400)),
    )
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({
      ok: false,
      errors: { email: 'invalidEmail' },
    })
  })

  it('429 { ok: false, error: rate_limited } → olduğu gibi döner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: false, error: 'rate_limited' }, 429)))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: false, error: 'rate_limited' })
  })

  it('500 { ok: false, error: server_error } → olduğu gibi döner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: false, error: 'server_error' }, 500)))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: false, error: 'server_error' })
  })

  it('HTTP durumu ok ama gövde ok:false değilse (tutarsız yanıt) → server_error\'a düşer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ unexpected: true }, 200)))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: false, error: 'server_error' })
  })

  it('fetch reddi (ağ hatası, ör. sunucu kapalı) → network döner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: false, error: 'network' })
  })

  it('yanıt gövdesi JSON olarak ayrıştırılamıyorsa → network döner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: () => Promise.reject(new Error('bozuk')) }))
    await expect(submitInquiry(validNewsletter)).resolves.toEqual({ ok: false, error: 'network' })
  })
})

describe('resolveErrorMessage', () => {
  function fakeTranslator(known: Record<string, string>) {
    const translator = ((key: string) => known[key] ?? `EKSİK:${key}`) as {
      (key: string): string
      has: (key: string) => boolean
    }
    translator.has = (key: string) => key in known
    return translator
  }

  it('bilinen bir anahtar geldiğinde doğrudan çeviriyi döner', () => {
    const t = fakeTranslator({ invalidEmail: 'Geçerli bir e-posta adresi girin.', generic: 'Bir şeyler ters gitti.' })
    expect(resolveErrorMessage(t, 'invalidEmail')).toBe('Geçerli bir e-posta adresi girin.')
  })

  it('mesaj dosyasında olmayan bir anahtar geldiğinde generic\'e bilinçli olarak düşer, ham anahtarı asla döndürmez', () => {
    const t = fakeTranslator({ generic: 'Bir şeyler ters gitti.' })
    const result = resolveErrorMessage(t, 'sunucudaYeniEklenmisAmaMesajDosyasindaOlmayanAnahtar')
    expect(result).toBe('Bir şeyler ters gitti.')
    expect(result).not.toMatch(/sunucudaYeniEklenmisAmaMesajDosyasindaOlmayanAnahtar/)
  })
})
