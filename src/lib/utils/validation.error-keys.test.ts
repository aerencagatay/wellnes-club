import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { flattenZodErrors, inquirySchema } from './validation'

/**
 * Sözleşme: flattenZodErrors HER ZAMAN anahtar döner, cümle değil (bkz. validation.ts
 * başındaki not). `toBeTruthy()` veya `typeof === 'string'` gibi kontroller bunu asla
 * yakalayamaz — İngilizce bir cümle de "truthy" bir string'tir. Bu dosya, geçersiz her
 * gövdenin ürettiği HER mesajın bariz bir camelCase anahtar biçimine uyduğunu doğrudan
 * denetler. Yeni bir alan eklendiğinde bu tablo genişletilmeli.
 */

const CAMP_SLUG = getAllCamps()[0].slug

const validCamp = {
  kind: 'camp' as const,
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 555 111 22 33',
  campSlug: CAMP_SLUG,
  guests: 2,
  roomPreference: 'paylasimli' as const,
  message: 'Tek başıma katılacağım.',
  consent: true as const,
}

const validContact = {
  kind: 'contact' as const,
  name: 'Mehmet Kaya',
  email: 'mehmet@example.com',
  message: 'Kurumsal grup için bilgi almak istiyorum.',
  consent: true as const,
}

const validNewsletter = {
  kind: 'newsletter' as const,
  email: 'okur@example.com',
  consent: true as const,
}

/** Bariz camelCase anahtar: yalnızca harf, boşluk/rakam/noktalama yok. */
const KEY_PATTERN = /^[a-zA-Z]+$/

const invalidCases: Array<[string, unknown]> = [
  // Kök seviyesinde bozuk gövdeler — kind alanına bile erişilemez.
  ['kök: null', null],
  ['kök: dizi', []],
  ['kök: dize', 'gecersiz'],
  ['kök: sayı', 42],
  ['kök: boş nesne', {}],
  ['kök: bilinmeyen kind', { ...validCamp, kind: 'spam' }],

  // camp: tamamen eksik zorunlu alanlar
  ['camp: name eksik', (() => { const { name: _n, ...rest } = validCamp; return rest })()],
  ['camp: email eksik', (() => { const { email: _e, ...rest } = validCamp; return rest })()],
  ['camp: phone eksik', (() => { const { phone: _p, ...rest } = validCamp; return rest })()],
  ['camp: campSlug eksik', (() => { const { campSlug: _c, ...rest } = validCamp; return rest })()],
  ['camp: guests eksik', (() => { const { guests: _g, ...rest } = validCamp; return rest })()],
  ['camp: roomPreference eksik', (() => { const { roomPreference: _r, ...rest } = validCamp; return rest })()],
  ['camp: consent eksik', (() => { const { consent: _cs, ...rest } = validCamp; return rest })()],

  // camp: brief'in kendi reddetme listeleri
  ['camp: name çok kısa', { ...validCamp, name: 'A' }],
  ['camp: name çok uzun', { ...validCamp, name: 'a'.repeat(81) }],
  ['camp: geçersiz email', { ...validCamp, email: 'ayse@' }],
  ['camp: phone boş', { ...validCamp, phone: '' }],
  ['camp: phone saçma', { ...validCamp, phone: 'telefon yok' }],
  ['camp: phone çok kısa', { ...validCamp, phone: '123' }],
  ['camp: phone çok uzun', { ...validCamp, phone: '+90 555 111 22 33'.repeat(2) }],
  ['camp: var olmayan campSlug', { ...validCamp, campSlug: 'olmayan-kamp' }],
  ['camp: guests sıfır', { ...validCamp, guests: 0 }],
  ['camp: guests üst sınır aşımı', { ...validCamp, guests: 9 }],
  ['camp: guests tam sayı değil', { ...validCamp, guests: 2.5 }],
  ['camp: geçersiz roomPreference', { ...validCamp, roomPreference: 'kral-suiti' }],
  ['camp: message çok uzun', { ...validCamp, message: 'a'.repeat(1001) }],
  ['camp: message yanlış tip', { ...validCamp, message: 12345 }],
  ['camp: consent false', { ...validCamp, consent: false }],
  ['camp: turnstileToken yanlış tip', { ...validCamp, turnstileToken: 12345 }],

  // contact
  ['contact: name eksik', (() => { const { name: _n, ...rest } = validContact; return rest })()],
  ['contact: email eksik', (() => { const { email: _e, ...rest } = validContact; return rest })()],
  ['contact: message eksik', (() => { const { message: _m, ...rest } = validContact; return rest })()],
  ['contact: consent eksik', (() => { const { consent: _cs, ...rest } = validContact; return rest })()],
  ['contact: message boş', { ...validContact, message: '' }],
  ['contact: consent false', { ...validContact, consent: false }],

  // newsletter
  ['newsletter: email eksik', (() => { const { email: _e, ...rest } = validNewsletter; return rest })()],
  ['newsletter: consent eksik', (() => { const { consent: _cs, ...rest } = validNewsletter; return rest })()],
  ['newsletter: consent false', { ...validNewsletter, consent: false }],
]

describe('flattenZodErrors sözleşmesi: her mesaj bir anahtardır, cümle değil', () => {
  it.each(invalidCases)('%s', (_label, input) => {
    const result = inquirySchema.safeParse(input)
    expect(result.success, 'beklenmedik biçimde geçerli kabul edildi').toBe(false)
    if (result.success) return

    const errors = flattenZodErrors(result.error)
    expect(Object.keys(errors).length).toBeGreaterThan(0)
    for (const [field, message] of Object.entries(errors)) {
      expect(message, `"${field}" alanı bir cümle sızdırıyor: ${JSON.stringify(message)}`).toMatch(KEY_PATTERN)
    }
  })
})
