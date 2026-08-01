import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { flattenZodErrors, inquirySchema } from './validation'

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

const parse = (input: unknown) => inquirySchema.safeParse(input)

describe('kind: camp', () => {
  it('geçerli gövdeyi kabul eder', () => {
    expect(parse(validCamp).success).toBe(true)
  })

  it('mesajı opsiyoneldir', () => {
    const { message, ...withoutMessage } = validCamp
    expect(parse(withoutMessage).success).toBe(true)
  })

  it('var olmayan kamp slug değerini reddeder', () => {
    const result = parse({ ...validCamp, campSlug: 'olmayan-kamp' })
    expect(result.success).toBe(false)
    if (!result.success) expect(flattenZodErrors(result.error).campSlug).toBeTruthy()
  })

  it('kişi sayısı sınırlarını uygular', () => {
    expect(parse({ ...validCamp, guests: 0 }).success).toBe(false)
    expect(parse({ ...validCamp, guests: 1 }).success).toBe(true)
    expect(parse({ ...validCamp, guests: 8 }).success).toBe(true)
    expect(parse({ ...validCamp, guests: 9 }).success).toBe(false)
    expect(parse({ ...validCamp, guests: 2.5 }).success).toBe(false)
  })

  it('mesaj uzunluk sınırını uygular', () => {
    expect(parse({ ...validCamp, message: 'a'.repeat(1000) }).success).toBe(true)
    expect(parse({ ...validCamp, message: 'a'.repeat(1001) }).success).toBe(false)
  })

  it('ad uzunluk sınırlarını uygular', () => {
    expect(parse({ ...validCamp, name: 'A' }).success).toBe(false)
    expect(parse({ ...validCamp, name: 'Al' }).success).toBe(true)
    expect(parse({ ...validCamp, name: 'a'.repeat(81) }).success).toBe(false)
  })

  it('geçersiz e-postayı reddeder', () => {
    expect(parse({ ...validCamp, email: 'ayse@' }).success).toBe(false)
  })

  it('telefon biçimlerini toleranslı kabul eder ama saçmalığı reddeder', () => {
    for (const phone of ['+905551112233', '0555 111 22 33', '(555) 111-22-33', '+44 20 7946 0958']) {
      expect(parse({ ...validCamp, phone }).success, phone).toBe(true)
    }
    for (const phone of ['telefon yok', '123', '']) {
      expect(parse({ ...validCamp, phone }).success, phone).toBe(false)
    }
  })

  it('KVKK onayı olmadan reddeder', () => {
    expect(parse({ ...validCamp, consent: false }).success).toBe(false)
  })

  it('oda tercihi enum dışı değeri reddeder', () => {
    expect(parse({ ...validCamp, roomPreference: 'kral-suiti' }).success).toBe(false)
  })
})

describe('kind: contact', () => {
  const validContact = {
    kind: 'contact' as const,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    message: 'Kurumsal grup için bilgi almak istiyorum.',
    consent: true as const,
  }

  it('geçerli gövdeyi kabul eder', () => {
    expect(parse(validContact).success).toBe(true)
  })

  it('telefon ve kamp alanlarını zorunlu tutmaz', () => {
    expect(parse(validContact).success).toBe(true)
  })

  it('mesajı zorunludur', () => {
    const { message, ...withoutMessage } = validContact
    expect(parse(withoutMessage).success).toBe(false)
  })
})

describe('kind: newsletter', () => {
  it('yalnızca e-posta ve onay ile geçerlidir', () => {
    expect(parse({ kind: 'newsletter', email: 'okur@example.com', consent: true }).success).toBe(true)
  })

  it('ad, telefon ve kamp alanlarını zorunlu tutmaz', () => {
    const result = parse({ kind: 'newsletter', email: 'okur@example.com', consent: true })
    expect(result.success).toBe(true)
  })

  it('onay olmadan reddeder', () => {
    expect(parse({ kind: 'newsletter', email: 'okur@example.com', consent: false }).success).toBe(false)
  })
})

describe('kind ayrımı', () => {
  it('bilinmeyen kind değerini reddeder', () => {
    expect(parse({ kind: 'spam', email: 'a@b.com', consent: true }).success).toBe(false)
  })

  it('kind eksikse reddeder', () => {
    expect(parse({ email: 'a@b.com', consent: true }).success).toBe(false)
  })
})

describe('flattenZodErrors', () => {
  it('alan adına göre tek mesaj döner', () => {
    const result = parse({ ...validCamp, email: 'bozuk', guests: 99 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = flattenZodErrors(result.error)
      expect(Object.keys(errors).sort()).toEqual(['email', 'guests'])
      expect(typeof errors.email).toBe('string')
    }
  })
})
