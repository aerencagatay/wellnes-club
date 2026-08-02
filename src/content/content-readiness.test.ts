import { describe, expect, it } from 'vitest'
import { getTestimonials } from './index'
import { site } from '@/lib/config/site'

const shouldRun = process.env.CHECK_LAUNCH_READY === '1'

describe.skipIf(!shouldRun)('yayın öncesi hazırlık', () => {
  it('örnek yorum kalmamıştır', () => {
    const placeholders = getTestimonials().filter((t) => t.isPlaceholder)
    expect(
      placeholders.map((t) => t.id),
      'Örnek yorumlar hâlâ yerinde — gerçek yorumlarla değiştirin veya bölümü kaldırın',
    ).toEqual([])
  })

  it('iletişim bilgileri yer tutucu değildir', () => {
    expect(site.phone, 'site.phone güncellenmedi').not.toContain('000 000')
    expect(site.email, 'site.email güncellenmedi').not.toBe('merhaba@serenityretreats.com')
    // site.instagram bare "https://instagram.com/" iken gerçek bir hesaba işaret etmez
    // (bkz. lib/seo/jsonld.ts → isRealProfileUrl) — Organization JSON-LD'de bu yüzden
    // Task 15'te bilinçli olarak dışlanır; yayın öncesi kapı bunu da yakalamalı.
    expect(site.instagram, 'site.instagram güncellenmedi').not.toBe('https://instagram.com/')
  })

  it('site URL değeri localhost değildir', () => {
    expect(site.url).not.toContain('localhost')
  })
})
