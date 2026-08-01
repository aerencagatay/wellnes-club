import { describe, expect, it } from 'vitest'
import { formatDateLong, formatDateRange } from './dates'

describe('formatDateRange', () => {
  it('aynı ay içindeki aralıkta ayı bir kez yazar', () => {
    expect(formatDateRange('2026-10-12', '2026-10-16', 'tr')).toBe('12–16 Ekim 2026')
    expect(formatDateRange('2026-10-12', '2026-10-16', 'en')).toBe('12–16 October 2026')
  })

  it('ay taşan aralıkta iki ayı da yazar', () => {
    expect(formatDateRange('2026-09-28', '2026-10-02', 'tr')).toBe('28 Eylül – 2 Ekim 2026')
    expect(formatDateRange('2026-09-28', '2026-10-02', 'en')).toBe('28 September – 2 October 2026')
  })

  it('yıl taşan aralıkta iki yılı da yazar', () => {
    expect(formatDateRange('2026-12-29', '2027-01-03', 'tr')).toBe('29 Aralık 2026 – 3 Ocak 2027')
    expect(formatDateRange('2026-12-29', '2027-01-03', 'en')).toBe('29 December 2026 – 3 January 2027')
  })

  it('tek günlük aralığı tek tarih olarak yazar', () => {
    expect(formatDateRange('2026-10-12', '2026-10-12', 'tr')).toBe('12 Ekim 2026')
  })
})

describe('formatDateLong', () => {
  it('tek tarihi uzun biçimde yazar', () => {
    expect(formatDateLong('2026-04-18', 'tr')).toBe('18 Nisan 2026')
    expect(formatDateLong('2026-04-18', 'en')).toBe('18 April 2026')
  })
})
