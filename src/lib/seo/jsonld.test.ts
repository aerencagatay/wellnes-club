import { describe, expect, it } from 'vitest'
import { getAllCamps, getFaq, getVenueForCamp } from '@/content'
import { site } from '@/lib/config/site'
import { buildCampEventJsonLd, buildFaqJsonLd, buildOrganizationJsonLd, isRealProfileUrl } from './jsonld'

const camp = getAllCamps()[0]
const venue = getVenueForCamp(camp)
const SITE = 'https://serenityretreats.com'

describe('buildCampEventJsonLd', () => {
  const jsonLd = buildCampEventJsonLd({ camp, venue, locale: 'tr', siteUrl: SITE })

  it('Event şeması üretir', () => {
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('Event')
  })

  it('adı ve açıklamayı istenen dilden alır', () => {
    expect(jsonLd.name).toBe(camp.title.tr)
    expect(jsonLd.description).toBe(camp.summary.tr)
    const en = buildCampEventJsonLd({ camp, venue, locale: 'en', siteUrl: SITE })
    expect(en.name).toBe(camp.title.en)
  })

  it('tarihleri ISO biçiminde verir', () => {
    expect(jsonLd.startDate).toBe(camp.startDate)
    expect(jsonLd.endDate).toBe(camp.endDate)
  })

  it('mekanı Place olarak koordinatlarıyla verir', () => {
    expect(jsonLd.location).toMatchObject({
      '@type': 'Place',
      name: venue.name,
      geo: { '@type': 'GeoCoordinates', latitude: venue.coordinates.lat, longitude: venue.coordinates.lng },
    })
  })

  it('teklifi fiyat, para birimi ve dile göre URL ile verir', () => {
    expect(jsonLd.offers).toMatchObject({
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: 'TRY',
      url: `${SITE}/tr/kamplar/${camp.slug}`,
    })
  })

  it('durumu schema.org sözlüğüne eşler', () => {
    expect(jsonLd.eventStatus).toBe('https://schema.org/EventScheduled')
    const closed = buildCampEventJsonLd({
      camp: { ...camp, status: 'closed' }, venue, locale: 'tr', siteUrl: SITE,
    })
    expect(closed.eventStatus).toBe('https://schema.org/EventCancelled')
  })

  it('sonunda eğik çizgi olan siteUrl değerinde çift eğik çizgi üretmez', () => {
    const withSlash = buildCampEventJsonLd({ camp, venue, locale: 'tr', siteUrl: `${SITE}/` })
    expect(withSlash.url).toBe(`${SITE}/tr/kamplar/${camp.slug}`)
  })

  it('teklifin uygunluğunu duruma ve boş yere göre ayarlar', () => {
    const openWithSpots = buildCampEventJsonLd({
      camp: { ...camp, status: 'open', spotsLeft: 5 }, venue, locale: 'tr', siteUrl: SITE,
    })
    expect(openWithSpots.offers).toMatchObject({ availability: 'https://schema.org/InStock' })

    const openNoSpots = buildCampEventJsonLd({
      camp: { ...camp, status: 'open', spotsLeft: 0 }, venue, locale: 'tr', siteUrl: SITE,
    })
    expect(openNoSpots.offers).toMatchObject({ availability: 'https://schema.org/SoldOut' })

    const waitlisted = buildCampEventJsonLd({
      camp: { ...camp, status: 'waitlist', spotsLeft: 0 }, venue, locale: 'tr', siteUrl: SITE,
    })
    expect(waitlisted.offers).toMatchObject({ availability: 'https://schema.org/SoldOut' })
  })
})

describe('buildOrganizationJsonLd', () => {
  it('Organization şeması üretir', () => {
    const jsonLd = buildOrganizationJsonLd({ siteUrl: SITE, locale: 'tr' })
    expect(jsonLd['@type']).toBe('Organization')
    expect(jsonLd.name).toBe('Serenity Retreats')
    expect(jsonLd.url).toBe(`${SITE}/tr`)
  })

  it('yer tutucu Instagram URL için sameAs alanını hiç üretmez', () => {
    // site.instagram şu an "https://instagram.com/" — yol içermeyen bir yer tutucu.
    // Gerçek bir profile bağlanana kadar `sameAs` yanlış bir iddia üretmemek için
    // tamamen atlanmalı (bkz. isRealProfileUrl testleri).
    expect(isRealProfileUrl(site.instagram)).toBe(false)
    const jsonLd = buildOrganizationJsonLd({ siteUrl: SITE, locale: 'tr' })
    expect(jsonLd).not.toHaveProperty('sameAs')
  })
})

describe('isRealProfileUrl', () => {
  it('yol içermeyen bir URL için false döner (yer tutucu)', () => {
    expect(isRealProfileUrl('https://instagram.com/')).toBe(false)
    expect(isRealProfileUrl('https://instagram.com')).toBe(false)
  })

  it('gerçek bir profil yolu için true döner', () => {
    expect(isRealProfileUrl('https://instagram.com/serenityretreats')).toBe(true)
  })

  it('geçersiz bir URL için false döner', () => {
    expect(isRealProfileUrl('not-a-url')).toBe(false)
  })
})

describe('buildFaqJsonLd', () => {
  it('her SSS kaydını Question olarak verir', () => {
    const items = getFaq()
    const jsonLd = buildFaqJsonLd({ items, locale: 'tr' })
    expect(jsonLd['@type']).toBe('FAQPage')
    expect(jsonLd.mainEntity).toHaveLength(items.length)
    expect((jsonLd.mainEntity as Record<string, unknown>[])[0]).toMatchObject({
      '@type': 'Question',
      name: items[0].question.tr,
      acceptedAnswer: { '@type': 'Answer', text: items[0].answer.tr },
    })
  })
})
