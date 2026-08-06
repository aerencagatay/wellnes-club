import type { CampSession } from './types'

/**
 * GERÇEK VERİ (kullanıcı onayı, 2026-08-06): tarih 11-13 Eylül 2026, fiyat
 * 10.500 TL, kontenjan 16 kişi — poster.png'deki "Rüzgar ve Deniz Yoga
 * Retreat" ile eşleşir. Diğer iki placeholder kamp kullanıcı isteğiyle
 * kaldırıldı: şu an tek gerçek/yaklaşan etkinlik bu.
 */
export const camps: CampSession[] = [
  {
    slug: 'ruzgar-ve-deniz-eylul-2026',
    program: 'yoga',
    title: { tr: 'Rüzgar ve Deniz Yoga Retreat', en: 'Wind & Sea Yoga Retreat' },
    summary: {
      tr: 'Sabah vinyasa, akşam yin. Üç gün boyunca telefonlardan uzakta, zeytinliklerin arasında nefesine dönüyorsun.',
      en: 'Vinyasa in the morning, yin in the evening. Three days away from screens, returning to your breath among olive groves.',
    },
    startDate: '2026-09-11',
    endDate: '2026-09-13',
    nights: 2,
    venueSlug: 'karadut-tas-otel',
    teacherSlugs: ['elif-demir', 'zeynep-arslan'],
    capacity: 16,
    spotsLeft: 16,
    priceFrom: 10500,
    currency: 'TRY',
    level: 'tum-seviyeler',
    status: 'open',
    heroImage: '/img/venue/hero.webp',
    gallery: ['/img/poster.png', '/img/venue/dis-cephe.webp', '/img/venue/balkon.webp', '/img/venue/hotel.webp'],
    includes: {
      tr: [
        '2 gece konaklama (paylaşımlı oda)',
        'Günde iki yoga seansı',
        'Üç öğün vejetaryen beslenme',
        'Nefes ve meditasyon atölyeleri',
        'Kadırga Koyu yürüyüşü',
        'Yoga matı ve ekipman',
      ],
      en: [
        '2 nights accommodation (shared room)',
        'Two yoga sessions daily',
        'Three vegetarian meals a day',
        'Breathwork and meditation workshops',
        'Walk to Kadırga Bay',
        'Mat and props provided',
      ],
    },
    excludes: {
      tr: ['Ulaşım', 'Alkollü içecekler', 'Kişisel masaj ve terapiler', 'Seyahat sigortası'],
      en: ['Transport', 'Alcoholic drinks', 'Personal massage and therapies', 'Travel insurance'],
    },
    dailyFlow: [
      {
        time: '07:00',
        title: { tr: 'Sessiz uyanış', en: 'Silent wake-up' },
        desc: { tr: 'Bahçede bitki çayı, konuşmasız yirmi dakika.', en: 'Herbal tea in the garden, twenty wordless minutes.' },
      },
      {
        time: '07:30',
        title: { tr: 'Sabah vinyasa', en: 'Morning vinyasa' },
        desc: { tr: 'Doksan dakikalık akış pratiği, nefes odaklı.', en: 'A ninety-minute breath-led flow practice.' },
      },
      {
        time: '09:30',
        title: { tr: 'Kahvaltı', en: 'Breakfast' },
        desc: {
          tr: 'Köy kahvaltısı; yerel zeytinyağı, ev peyniri, mevsim meyveleri.',
          en: 'Village breakfast: local olive oil, homemade cheese, seasonal fruit.',
        },
      },
      {
        time: '11:00',
        title: { tr: 'Atölye', en: 'Workshop' },
        desc: { tr: 'Nefes teknikleri veya anatomi üzerine oturum.', en: 'A session on breath technique or anatomy.' },
      },
      {
        time: '13:00',
        title: { tr: 'Öğle ve serbest zaman', en: 'Lunch and free time' },
        desc: { tr: 'Havuz, kitap, uyku ya da koya yürüyüş.', en: 'Pool, a book, a nap, or a walk to the bay.' },
      },
      {
        time: '17:30',
        title: { tr: 'Akşam yin', en: 'Evening yin' },
        desc: { tr: 'Uzun tutuşlar, destekli pozlar, kapanış meditasyonu.', en: 'Long holds, supported poses, closing meditation.' },
      },
      {
        time: '19:30',
        title: { tr: 'Akşam yemeği', en: 'Dinner' },
        desc: { tr: 'Taş terasta ortak masa.', en: 'A shared table on the stone terrace.' },
      },
    ],
    featured: true,
  },
]
