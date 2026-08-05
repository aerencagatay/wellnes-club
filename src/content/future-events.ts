import type { FutureEvent } from './types'

/**
 * "Coming soon" — Assos retreat'i ilk etkinlik, bunlar henüz tarihi
 * belirlenmemiş gelecek etkinlikler (bkz. editorial redesign brief §4.6).
 * Görseller mekan setinden (src/content/venues.ts galerisi) yeniden
 * kullanılır: bunlar mekan bölümünün gerçek otel fotoğrafları, faaliyetin
 * kendisinin fotoğrafı değil — birer atmosfer/teaser görseli olarak
 * kullanılır, uydurma bir yol icat edilmez.
 */
export const futureEvents: FutureEvent[] = [
  {
    slug: 'hiking',
    kind: 'hiking',
    title: { tr: 'Doğa Yürüyüşü', en: 'Hiking' },
    summary: {
      tr: 'Zeytinlikler ve kıyı patikalarında sakin, rehberli yürüyüşler.',
      en: 'Calm, guided walks through olive groves and coastal trails.',
    },
    image: '/img/venue/kusbakisi.webp',
  },
  {
    slug: 'camping',
    kind: 'camping',
    title: { tr: 'Kamp', en: 'Camping' },
    summary: {
      tr: 'Açık havada, yıldızların altında birkaç gecelik bir sığınak.',
      en: 'A few nights under the stars, away from everything.',
    },
    image: '/img/venue/bahce.webp',
  },
  {
    slug: 'running',
    kind: 'running',
    title: { tr: 'Koşu Kampı', en: 'Running Camp' },
    summary: {
      tr: 'Sabah ışığında kıyı boyunca uzun, sakin koşular.',
      en: 'Long, unhurried coastal runs in the morning light.',
    },
    image: '/img/venue/dis-cephe.webp',
  },
  {
    slug: 'water-sports',
    kind: 'water-sports',
    title: { tr: 'Su Sporları', en: 'Water Sports' },
    summary: {
      tr: 'Kano ve kürekle Ege’nin sakin koylarında bir gün.',
      en: 'A day on the Aegean’s calm bays by kayak and paddle.',
    },
    image: '/img/venue/havuz.webp',
  },
  {
    slug: 'wildlife-atv',
    kind: 'wildlife',
    title: { tr: 'ATV ile Yaban Hayatı Turu', en: 'ATV Wildlife Tour' },
    summary: {
      tr: 'ATV ile iç bölgelere, yaban hayatının izini sürmeye.',
      en: 'By ATV into the backcountry, tracking the region’s wildlife.',
    },
    image: '/img/venue/hotel.webp',
  },
]
