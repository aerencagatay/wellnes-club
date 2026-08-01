import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import type { CampSession } from '@/content'
import { filterCamps, getCampBadge, LAST_SPOTS_THRESHOLD } from './camp-status'

const base = getAllCamps()[0]
const camp = (patch: Partial<CampSession>): CampSession => ({ ...base, ...patch })

describe('getCampBadge', () => {
  it('closed durumu her şeyi ezer', () => {
    expect(getCampBadge(camp({ status: 'closed', spotsLeft: 10 }))).toBe('closed')
  })

  it('waitlist durumu son yerler rozetini ezer', () => {
    expect(getCampBadge(camp({ status: 'waitlist', spotsLeft: 0 }))).toBe('waitlist')
  })

  it('eşik ve altındaki boş yer sayısı son yerler rozeti verir', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: LAST_SPOTS_THRESHOLD }))).toBe('last-spots')
    expect(getCampBadge(camp({ status: 'open', spotsLeft: 1 }))).toBe('last-spots')
  })

  it('eşiğin üstündeki boş yer sayısı açık rozeti verir', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: LAST_SPOTS_THRESHOLD + 1 }))).toBe('open')
  })

  it('open durumda sıfır boş yer son yerler değil, waitlist gibi davranmaz — closed sayılır', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: 0 }))).toBe('closed')
  })
})

describe('filterCamps', () => {
  const items = [
    camp({ slug: 'a', program: 'yoga', level: 'baslangic' }),
    camp({ slug: 'b', program: 'pilates', level: 'tum-seviyeler' }),
    camp({ slug: 'c', program: 'yoga-pilates', level: 'baslangic' }),
  ]

  it('filtre yoksa hepsini döner', () => {
    expect(filterCamps(items, {})).toHaveLength(3)
    expect(filterCamps(items, { program: 'all', level: 'all' })).toHaveLength(3)
  })

  it('programa göre filtreler', () => {
    expect(filterCamps(items, { program: 'yoga' }).map((c) => c.slug)).toEqual(['a'])
  })

  it('seviyeye göre filtreler', () => {
    expect(filterCamps(items, { level: 'baslangic' }).map((c) => c.slug)).toEqual(['a', 'c'])
  })

  it('program ve seviyeyi birlikte uygular', () => {
    expect(filterCamps(items, { program: 'yoga-pilates', level: 'baslangic' }).map((c) => c.slug)).toEqual(['c'])
    expect(filterCamps(items, { program: 'yoga', level: 'tum-seviyeler' })).toEqual([])
  })

  it('girdi dizisini değiştirmez', () => {
    const copy = [...items]
    filterCamps(items, { program: 'yoga' })
    expect(items).toEqual(copy)
  })
})
