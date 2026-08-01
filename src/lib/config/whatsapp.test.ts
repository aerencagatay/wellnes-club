import { afterEach, describe, expect, it, vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('./whatsapp')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('buildWhatsAppUrl', () => {
  it('numara tanımsızsa null döner ve devre dışıdır', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '')
    const { buildWhatsAppUrl, isWhatsAppEnabled } = await load()
    expect(buildWhatsAppUrl('merhaba')).toBeNull()
    expect(isWhatsAppEnabled()).toBe(false)
  })

  it('numaradaki boşluk, artı ve tire karakterlerini temizler', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '+90 501 091 34 17')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl()).toBe('https://wa.me/905010913417')
  })

  it('mesajı URL kodlar', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '905010913417')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl('Ekim kampı için bilgi & fiyat?')).toBe(
      'https://wa.me/905010913417?text=Ekim%20kamp%C4%B1%20i%C3%A7in%20bilgi%20%26%20fiyat%3F',
    )
  })

  it('boş mesajda text parametresi eklemez', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '905010913417')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl('   ')).toBe('https://wa.me/905010913417')
  })
})
