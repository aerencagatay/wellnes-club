import { describe, expect, it } from 'vitest'
import {
  MEMBERSHIP_AGE_MAX,
  MEMBERSHIP_AGE_MIN,
  type MembershipDraft,
  validateMembership,
} from './membership-validation'

const VALID: MembershipDraft = {
  firstName: 'Deniz',
  lastName: 'Yılmaz',
  email: 'deniz@example.com',
  phone: '+90 538 048 04 28',
  age: '32',
  gender: 'unspecified',
  yogaLevel: 'beginner',
}

/** Tek bir alanı bozup geri kalanı geçerli bırakır. */
const withField = (field: keyof MembershipDraft, value: string): MembershipDraft => ({
  ...VALID,
  [field]: value,
})

describe('validateMembership', () => {
  it('tamamen geçerli bir başvuruda hiç hata döndürmez', () => {
    expect(validateMembership(VALID)).toEqual({})
  })

  it('her zorunlu alanın boşluğunu yakalar', () => {
    // Yalnızca "boş bırakılamaz" davranışının TAMAMINI tarar: alan listesi
    // büyüdüğünde yeni alanın zorunluluk kontrolü unutulursa burası kırılır.
    for (const field of Object.keys(VALID) as (keyof MembershipDraft)[]) {
      expect(validateMembership(withField(field, '')), field).toHaveProperty(field, 'required')
    }
  })

  it('yalnızca boşluktan oluşan değeri boş sayar', () => {
    expect(validateMembership(withField('firstName', '   '))).toHaveProperty('firstName', 'required')
  })

  it('tek harflik adı reddeder ama iki harfliyi kabul eder', () => {
    expect(validateMembership(withField('firstName', 'A'))).toHaveProperty('firstName', 'nameTooShort')
    expect(validateMembership(withField('firstName', 'Al')).firstName).toBeUndefined()
  })

  it('bozuk e-posta biçimlerini reddeder', () => {
    for (const bad of ['deniz', 'deniz@', '@example.com', 'deniz@example', 'a b@example.com']) {
      expect(validateMembership(withField('email', bad)), bad).toHaveProperty('email', 'invalidEmail')
    }
  })

  it('hem Türkiye hem uluslararası telefon biçimlerini kabul eder', () => {
    // Prompt açıkça iki biçimi de istiyor; katı bir Türkiye deseni yurt
    // dışından başvuranı sessizce dışarıda bırakırdı.
    for (const good of ['05380480428', '+90 538 048 04 28', '+1 (415) 555-0123', '0538.048.04.28']) {
      expect(validateMembership(withField('phone', good)).phone, good).toBeUndefined()
    }
  })

  it('harf içeren veya çok kısa telefonu reddeder', () => {
    for (const bad of ['telefon yok', '12345', '+90 abc def']) {
      expect(validateMembership(withField('phone', bad)), bad).toHaveProperty('phone', 'invalidPhone')
    }
  })

  it('yaş sınırlarını uçlarda doğru uygular', () => {
    expect(validateMembership(withField('age', String(MEMBERSHIP_AGE_MIN))).age).toBeUndefined()
    expect(validateMembership(withField('age', String(MEMBERSHIP_AGE_MAX))).age).toBeUndefined()
    expect(validateMembership(withField('age', String(MEMBERSHIP_AGE_MIN - 1)))).toHaveProperty(
      'age',
      'invalidAge',
    )
    expect(validateMembership(withField('age', String(MEMBERSHIP_AGE_MAX + 1)))).toHaveProperty(
      'age',
      'invalidAge',
    )
  })

  it('sayı olmayan veya ondalıklı yaşı reddeder', () => {
    // '25abc' özellikle önemli: `parseInt` bunu sessizce 25 olarak kabul
    // ederdi (bkz. membership-validation.ts'teki `Number()` notu).
    for (const bad of ['25abc', 'otuz', '32.5', '']) {
      expect(validateMembership(withField('age', bad)).age, bad).toBeDefined()
    }
  })

  it('birden fazla hatayı aynı anda döndürür', () => {
    const errors = validateMembership({ ...VALID, email: 'bozuk', age: '5', phone: '' })
    expect(errors).toEqual({ email: 'invalidEmail', age: 'invalidAge', phone: 'required' })
  })
})
