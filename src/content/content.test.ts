import { describe, expect, it } from 'vitest'
import {
  getAllCamps, getAllTeachers, getAllVenues, getCampBySlug, getCampsForTeacher,
  getFaq, getFeaturedCamps, getFutureEvents, getPastCamps, getTeachersForCamp, getTestimonials,
  getUpcomingCamps, getVenueBySlug, getVenueForCamp,
} from './index'
import type { Localized, LocalizedList } from './types'
import { PRIMARY_VENUE_SLUG } from '@/lib/config/site'

const camps = getAllCamps()
const teachers = getAllTeachers()
const venues = getAllVenues()
const faqItems = getFaq()
const testimonialItems = getTestimonials()
const futureEvents = getFutureEvents()

function expectLocalized(value: Localized, label: string) {
  expect(value.tr?.trim(), `${label}.tr boş`).toBeTruthy()
  expect(value.en?.trim(), `${label}.en boş`).toBeTruthy()
}

function expectLocalizedList(value: LocalizedList, label: string) {
  expect(value.tr.length, `${label}.tr boş dizi`).toBeGreaterThan(0)
  expect(value.en.length, `${label}.en uzunluğu tr ile eşleşmiyor`).toBe(value.tr.length)
}

describe('içerik bütünlüğü', () => {
  it('en az bir kamp, hoca ve mekan vardır', () => {
    expect(camps.length).toBeGreaterThan(0)
    expect(teachers.length).toBeGreaterThan(0)
    expect(venues.length).toBeGreaterThan(0)
  })

  it('tüm slug değerleri tekildir', () => {
    for (const [label, items] of [['camps', camps], ['teachers', teachers], ['venues', venues]] as const) {
      const slugs = items.map((i) => i.slug)
      expect(new Set(slugs).size, `${label} içinde yinelenen slug`).toBe(slugs.length)
    }
  })

  it('slug değerleri kebab-case biçimindedir', () => {
    for (const item of [...camps, ...teachers, ...venues]) {
      expect(item.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('her kampın venueSlug değeri çözülür', () => {
    for (const camp of camps) expect(() => getVenueForCamp(camp)).not.toThrow()
  })

  // `PRIMARY_VENUE_SLUG` (src/lib/config/site.ts), venues.ts'teki slug'lardan bağımsız
  // bir literal olarak `iletisim/page.tsx`, `mekan/page.tsx` ve `venue-preview.tsx`
  // içinde `notFound()`'a düşen bir çözümleme için kullanılır. `venues.ts`'te bu slug
  // yeniden adlandırılırsa bu test kırılır — aksi halde sitenin birincil dönüşüm
  // sayfası (iletişim) sessizce 404 vermeye başlardı.
  it('PRIMARY_VENUE_SLUG bir mekana çözülür', () => {
    expect(getVenueBySlug(PRIMARY_VENUE_SLUG)).not.toBeUndefined()
  })

  it('her kampın tüm teacherSlugs değerleri çözülür', () => {
    for (const camp of camps) {
      expect(camp.teacherSlugs.length, `${camp.slug} hocasız`).toBeGreaterThan(0)
      expect(getTeachersForCamp(camp)).toHaveLength(camp.teacherSlugs.length)
    }
  })

  it('tarihler geçerli ve tutarlıdır', () => {
    for (const camp of camps) {
      expect(camp.startDate, `${camp.slug} startDate biçimi`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(camp.endDate, `${camp.slug} endDate biçimi`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(camp.endDate >= camp.startDate, `${camp.slug} endDate < startDate`).toBe(true)
      const days = Math.round(
        (Date.parse(camp.endDate) - Date.parse(camp.startDate)) / 86_400_000,
      )
      expect(camp.nights, `${camp.slug} nights tarih aralığıyla uyuşmuyor`).toBe(days)
    }
  })

  it('kontenjan ve fiyat değerleri tutarlıdır', () => {
    for (const camp of camps) {
      expect(camp.capacity).toBeGreaterThan(0)
      expect(camp.spotsLeft).toBeGreaterThanOrEqual(0)
      expect(camp.spotsLeft, `${camp.slug} spotsLeft > capacity`).toBeLessThanOrEqual(camp.capacity)
      expect(camp.priceFrom).toBeGreaterThan(0)
    }
  })

  it('waitlist durumundaki kampta boş yer yoktur', () => {
    for (const camp of camps) {
      if (camp.status === 'waitlist') expect(camp.spotsLeft, `${camp.slug}`).toBe(0)
    }
  })

  it('tüm çok dilli alanlar iki dilde doludur', () => {
    for (const camp of camps) {
      expectLocalized(camp.title, `${camp.slug}.title`)
      expectLocalized(camp.summary, `${camp.slug}.summary`)
      expectLocalizedList(camp.includes, `${camp.slug}.includes`)
      expectLocalizedList(camp.excludes, `${camp.slug}.excludes`)
      expect(camp.dailyFlow.length, `${camp.slug} dailyFlow kısa`).toBeGreaterThanOrEqual(6)
      for (const [i, item] of camp.dailyFlow.entries()) {
        expect(item.time).toMatch(/^\d{2}:\d{2}$/)
        expectLocalized(item.title, `${camp.slug}.dailyFlow[${i}].title`)
        expectLocalized(item.desc, `${camp.slug}.dailyFlow[${i}].desc`)
      }
    }
    for (const t of teachers) {
      expectLocalized(t.title, `${t.slug}.title`)
      expectLocalized(t.bio, `${t.slug}.bio`)
      expectLocalizedList(t.certifications, `${t.slug}.certifications`)
    }
    for (const v of venues) {
      expectLocalized(v.shortDescription, `${v.slug}.shortDescription`)
      expectLocalized(v.location, `${v.slug}.location`)
      expectLocalizedList(v.highlights, `${v.slug}.highlights`)
      expect(v.gallery.length, `${v.slug} galeri kısa`).toBeGreaterThanOrEqual(4)
    }
    for (const f of faqItems) {
      expectLocalized(f.question, `faq[${f.id}].question`)
      expectLocalized(f.answer, `faq[${f.id}].answer`)
    }
    for (const t of testimonialItems) {
      expectLocalized(t.quote, `testimonial[${t.id}].quote`)
    }
  })

  it('görsel yolları /img/ ile başlar', () => {
    const paths = [
      ...camps.flatMap((c) => [c.heroImage, ...c.gallery]),
      ...teachers.map((t) => t.photo),
      ...venues.flatMap((v) => v.gallery),
      ...futureEvents.map((e) => e.image),
    ]
    for (const p of paths) expect(p).toMatch(/^\/img\//)
  })
})

describe('gelecek etkinlikler bütünlüğü', () => {
  it('en az bir gelecek etkinlik vardır', () => {
    expect(futureEvents.length).toBeGreaterThan(0)
  })

  it('tüm slug değerleri tekildir', () => {
    const slugs = futureEvents.map((e) => e.slug)
    expect(new Set(slugs).size, 'futureEvents içinde yinelenen slug').toBe(slugs.length)
  })

  it('slug değerleri kebab-case biçimindedir', () => {
    for (const event of futureEvents) {
      expect(event.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('tüm çok dilli alanlar iki dilde doludur', () => {
    for (const event of futureEvents) {
      expectLocalized(event.title, `${event.slug}.title`)
      expectLocalized(event.summary, `${event.slug}.summary`)
    }
  })

  it('görsel yolu /img/ ile başlar', () => {
    for (const event of futureEvents) {
      expect(event.image, `${event.slug}.image`).toMatch(/^\/img\//)
    }
  })
})

describe('içerik seçicileri', () => {
  const TODAY = '2026-08-01'

  it('getAllCamps startDate\'e göre artan sıralar', () => {
    const dates = getAllCamps().map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort())
  })

  it('getUpcomingCamps geçmiş kampları dışlar ve artan sıralar', () => {
    const upcoming = getUpcomingCamps(TODAY)
    expect(upcoming.length).toBeGreaterThan(0)
    for (const c of upcoming) expect(c.endDate >= TODAY).toBe(true)
    const dates = upcoming.map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort())
  })

  it('getUpcomingCamps limit parametresine uyar', () => {
    expect(getUpcomingCamps(TODAY, 1)).toHaveLength(1)
  })

  it('getPastCamps yalnızca bitmiş kampları azalan sırada döner', () => {
    const past = getPastCamps(TODAY)
    for (const c of past) expect(c.endDate < TODAY).toBe(true)
    const dates = past.map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('upcoming ve past birlikte tüm kampları kapsar, örtüşmez', () => {
    expect(getUpcomingCamps(TODAY).length + getPastCamps(TODAY).length).toBe(camps.length)
  })

  it('getCampBySlug bilinmeyen slug için undefined döner', () => {
    expect(getCampBySlug('yok-boyle-bir-kamp')).toBeUndefined()
    expect(getCampBySlug(camps[0].slug)?.slug).toBe(camps[0].slug)
  })

  it('getFeaturedCamps yalnızca featured kampları döner', () => {
    const featured = getFeaturedCamps()
    expect(featured.length).toBeGreaterThan(0)
    for (const c of featured) expect(c.featured).toBe(true)
  })

  it('getCampsForTeacher ters ilişkiyi doğru kurar', () => {
    for (const t of teachers) {
      const found = getCampsForTeacher(t.slug)
      for (const c of found) expect(c.teacherSlugs).toContain(t.slug)
      const expected = camps.filter((c) => c.teacherSlugs.includes(t.slug)).length
      expect(found).toHaveLength(expected)
    }
    expect(getCampsForTeacher('olmayan-hoca')).toEqual([])
  })

  it('getVenueForCamp bilinmeyen mekan için açıklayıcı hata verir', () => {
    const broken = { ...camps[0], venueSlug: 'olmayan-mekan' }
    expect(() => getVenueForCamp(broken)).toThrow(/olmayan-mekan/)
  })
})
