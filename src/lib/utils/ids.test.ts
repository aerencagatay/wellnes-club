import { describe, expect, it } from 'vitest'
import { generateReferenceId } from './ids'

describe('generateReferenceId', () => {
  const now = new Date('2026-07-31T14:05:00Z')

  it('SR-YYYYMMDD-XXXX kalıbına uyar', () => {
    expect(generateReferenceId(now)).toMatch(/^SR-\d{8}-[A-Z2-7]{4}$/)
  })

  it('verilen tarihi kullanır', () => {
    expect(generateReferenceId(now).slice(0, 12)).toBe('SR-20260731-')
  })

  it('ardışık çağrılarda farklı değer üretir', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateReferenceId(now)))
    // 32^4 = 1.048.576 olasılık; 200 örnekte çakışma pratikte imkânsız.
    expect(ids.size).toBe(200)
  })

  it('karıştırılabilir karakterler (0, 1, 8, 9, I, O) içermez', () => {
    const suffixes = Array.from({ length: 300 }, () => generateReferenceId(now).slice(-4)).join('')
    expect(suffixes).not.toMatch(/[0189IO]/)
  })
})
