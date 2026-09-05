import { describe, expect, it } from 'vitest'
import {
  getAllCamps, getAllTeachers, getAllVenues, getCampBySlug, getCampsForTeacher,
  getAllEvents, getEventBySlug, getFaq, getFeaturedCamps, getPastCamps, getTeachersForCamp,
  getTestimonials, getUpcomingCamps, getUpcomingEvents, getVenueBySlug, getVenueForCamp,
} from './index'
import type { Localized, LocalizedList } from './types'
import { PRIMARY_VENUE_SLUG } from '@/lib/config/site'

const camps = getAllCamps()
const teachers = getAllTeachers()
const venues = getAllVenues()
const faqItems = getFaq()
const testimonialItems = getTestimonials()
const allEvents = getAllEvents()

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

  /**
   * `priceFrom` kamp kartlarında, CTA'da ve Event JSON-LD'sinde görünen TEK
   * fiyattır; `priceTiers` ise detay sayfasındaki tam tablo. İkisi ayrı
   * alanlar olduğu için sessizce ayrışabilirler — biri güncellenip diğeri
   * unutulduğunda site, listede bir fiyat gösterip detayda başka bir fiyat
   * gösterir. Aşağıdaki eşitlik bunun nöbetçisidir: `priceFrom`, tam programın
   * (tüm geceler, paylaşımlı oda) kademesine EŞİT olmak zorundadır.
   */
  it('fiyat kademeleri tutarlıdır ve priceFrom tam program kademesine eşittir', () => {
    for (const camp of camps) {
      expect(camp.priceTiers.length, `${camp.slug} fiyat kademesi yok`).toBeGreaterThan(0)

      const keys = camp.priceTiers.map((tier) => `${tier.occupancy}-${tier.nights}`)
      expect(new Set(keys).size, `${camp.slug} içinde yinelenen fiyat kademesi`).toBe(keys.length)

      for (const tier of camp.priceTiers) {
        const label = `${camp.slug} ${tier.occupancy}/${tier.nights}`
        expect(tier.price, `${label} fiyatı`).toBeGreaterThan(0)
        expect(tier.nights, `${label} gece sayısı`).toBeGreaterThanOrEqual(1)
        expect(tier.nights, `${label} kampın gece sayısını aşıyor`).toBeLessThanOrEqual(camp.nights)
      }

      const fullProgram = camp.priceTiers.find(
        (tier) => tier.occupancy === 'double' && tier.nights === camp.nights,
      )
      expect(fullProgram, `${camp.slug}: tam program (paylaşımlı oda, ${camp.nights} gece) kademesi eksik`).toBeDefined()
      expect(fullProgram!.price, `${camp.slug}: priceFrom tam program kademesiyle uyuşmuyor`).toBe(camp.priceFrom)

      // Tek kişilik oda, aynı gece sayısında paylaşımlı odadan ucuz olamaz —
      // ters çevrilmiş bir çift, veri girişinde yer değiştirmiş iki sayıdır.
      for (const single of camp.priceTiers.filter((tier) => tier.occupancy === 'single')) {
        const double = camp.priceTiers.find((t) => t.occupancy === 'double' && t.nights === single.nights)
        if (double) {
          expect(
            single.price >= double.price,
            `${camp.slug}: ${single.nights} gecede tek kişilik oda paylaşımlıdan ucuz`,
          ).toBe(true)
        }
      }
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
      // `bio` ve `certifications` isteğe bağlıdır: hoca gerçek bir kişidir ve
      // bu alanlar kendisinden doğrulanmış bilgi gelene kadar boş bırakılır
      // (bkz. content/types.ts). Zorunlu tutmak, testi geçirmek için uydurma
      // özgeçmiş yazılmasını teşvik ederdi. Ama VARSA iki dilde dolu olmalı.
      if (t.bio) expectLocalized(t.bio, `${t.slug}.bio`)
      if (t.certifications) expectLocalizedList(t.certifications, `${t.slug}.certifications`)
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
      ...teachers.flatMap((t) => (t.photo ? [t.photo] : [])),
      ...venues.flatMap((v) => v.gallery),
      ...allEvents.map((e) => e.media.src),
    ]
    for (const p of paths) expect(p).toMatch(/^\/img\//)
  })
})

describe('etkinlik bütünlüğü', () => {
  it('en az bir etkinlik vardır', () => {
    expect(allEvents.length).toBeGreaterThan(0)
  })

  it('tüm slug ve id değerleri tekildir', () => {
    const slugs = allEvents.map((e) => e.slug)
    expect(new Set(slugs).size, 'events içinde yinelenen slug').toBe(slugs.length)
    const ids = allEvents.map((e) => e.id)
    expect(new Set(ids).size, 'events içinde yinelenen id').toBe(ids.length)
  })

  it('slug değerleri kebab-case biçimindedir', () => {
    for (const event of allEvents) {
      expect(event.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('tüm çok dilli alanlar iki dilde doludur', () => {
    for (const event of allEvents) {
      expectLocalized(event.title, `${event.slug}.title`)
      expectLocalized(event.location, `${event.slug}.location`)
      expectLocalized(event.shortDescription, `${event.slug}.shortDescription`)
      expectLocalized(event.media.alt, `${event.slug}.media.alt`)
    }
  })

  // Bu, dosyadaki en önemli denetimdir. `isPlaceholder: true` bir kayıt GERÇEK
  // BİR ETKİNLİĞE KARŞILIK GELMEZ (bkz. events.ts başlığı) — böyle bir kayda
  // fiyat veya tarih eklenirse arayüz onu gerçek bir etkinlik gibi, çalışan bir
  // rezervasyon CTA'sıyla göstermeye başlar ve gerçek müşteriyi var olmayan bir
  // etkinliğe yönlendirir. Testin kırılması "beklentiyi güncelle" demek DEĞİL,
  // "bu etkinlik gerçekse `isPlaceholder` alanını false yap" demektir.
  it('ÖRNEK kayıtların fiyatı ve tarihi yoktur', () => {
    for (const event of allEvents.filter((e) => e.isPlaceholder)) {
      expect(event.price, `${event.slug}: örnek kayıtta fiyat olamaz`).toBeUndefined()
      expect(event.dateStart, `${event.slug}: örnek kayıtta tarih olamaz`).toBeUndefined()
      expect(event.dateEnd, `${event.slug}: örnek kayıtta tarih olamaz`).toBeUndefined()
      expect(event.campSlug, `${event.slug}: örnek kayıt gerçek kampa bağlanamaz`).toBeUndefined()
    }
  })

  it('gerçek kayıtların fiyatı, tarihi ve programı vardır', () => {
    const real = allEvents.filter((e) => !e.isPlaceholder)
    expect(real.length, 'en az bir gerçek etkinlik olmalı').toBeGreaterThan(0)
    for (const event of real) {
      expect(event.price, `${event.slug}.price`).toBeGreaterThan(0)
      expect(event.dateStart, `${event.slug}.dateStart`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(event.dateEnd, `${event.slug}.dateEnd`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(event.dateEnd! >= event.dateStart!, `${event.slug}: dateEnd < dateStart`).toBe(true)
      expect(event.schedule.length, `${event.slug}: gerçek etkinlik programsız`).toBeGreaterThan(0)
    }
  })

  it('program günleri iki dilde ve geçerli saat biçimindedir', () => {
    for (const event of allEvents) {
      for (const [d, day] of event.schedule.entries()) {
        expectLocalized(day.day, `${event.slug}.schedule[${d}].day`)
        expect(day.items.length, `${event.slug}.schedule[${d}] boş gün`).toBeGreaterThan(0)
        for (const [i, item] of day.items.entries()) {
          expect(item.time, `${event.slug}.schedule[${d}].items[${i}].time`).toMatch(/^\d{2}:\d{2}$/)
          expectLocalized(item.title, `${event.slug}.schedule[${d}].items[${i}].title`)
        }
      }
    }
  })

  it('video medyası her zaman poster taşır', () => {
    for (const event of allEvents) {
      if (event.media.type === 'video') {
        expect(event.media.poster, `${event.slug}: postersiz video`).toBeTruthy()
      }
    }
  })

  it('getUpcomingEvents bitmiş etkinlikleri dışlar, tarihsizleri korur', () => {
    const past = getUpcomingEvents('2099-01-01')
    for (const e of past) expect(e.dateEnd, `${e.slug} bitmiş olmalıydı`).toBeUndefined()
    const now = getUpcomingEvents('2026-08-01')
    expect(now.length).toBe(allEvents.length)
  })

  it('getAllEvents tarihlileri artan sırada, tarihsizleri sonda tutar', () => {
    const dated = allEvents.filter((e) => e.dateStart).map((e) => e.dateStart!)
    expect(dated).toEqual([...dated].sort())
    const firstUndated = allEvents.findIndex((e) => !e.dateStart)
    if (firstUndated !== -1) {
      for (const e of allEvents.slice(firstUndated)) expect(e.dateStart).toBeUndefined()
    }
  })

  it('getEventBySlug bilinmeyen slug için undefined döner', () => {
    expect(getEventBySlug('yok-boyle-bir-etkinlik')).toBeUndefined()
    expect(getEventBySlug(allEvents[0].slug)?.slug).toBe(allEvents[0].slug)
  })

  it('gerçek etkinliğin campSlug değeri bir kampa çözülür', () => {
    for (const event of allEvents.filter((e) => e.campSlug)) {
      expect(getCampBySlug(event.campSlug!), `${event.slug}.campSlug`).toBeDefined()
    }
  })

  // Bu, gerçekte yaşanmış bir kusurun nöbetçisi: kamp listesi tek gerçek
  // etkinliğe indirildiğinde testimonial kayıtları silinmiş kamplara işaret
  // etmeye devam etti. Arayüz kamp adını çözemediğinde sessizce boş geçtiği
  // için hata görünmüyordu — bu yüzden veri katmanında yakalanması gerekiyor.
  it('testimonial campSlug değerleri var olan bir kampa çözülür', () => {
    for (const t of testimonialItems.filter((t) => t.campSlug)) {
      expect(getCampBySlug(t.campSlug!), `testimonial[${t.id}].campSlug`).toBeDefined()
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
