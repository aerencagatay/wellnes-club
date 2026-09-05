import type { CampSession } from './types'

/**
 * GERÇEK VERİ (kullanıcı onayı, 2026-09-05): tarih 18-20 Eylül 2026, kontenjan
 * 16 kişi. Etkinliğin duyuru posterleriyle eşleşir:
 * `public/img/poster/canakkale-18-20-eylul-2026-*.jpeg`.
 *
 * Tarih 11-13 Eylül'den 18-20 Eylül'e KAYDI (aynı etkinlik, yeni tarih —
 * kullanıcı teyidi, 2026-09-05); ikinci bir kamp açılmadı.
 *
 * Fiyat artık tek sayı değil, dört kademe (`priceTiers`): oda tipi × gece
 * sayısı. `priceFrom` bilinçli olarak 10.500 TL'de tutuluyor — bu, tam
 * programın (2 gece, paylaşımlı oda) başlangıç fiyatı. En düşük kademe olan
 * 6.500 TL tek gecelik katılıma ait; onu `priceFrom` yapmak kartlarda tam
 * programın karşılığı olmayan bir fiyat göstermek olurdu (kullanıcı kararı).
 */
export const camps: CampSession[] = [
  {
    slug: 'ruzgar-ve-deniz-eylul-2026',
    program: 'yoga',
    // Ad "Asos Yoga Retreat" (kullanıcı isteği, 2026-08-15; yazım 2026-09-05'te
    // "Assos" → "Asos" olarak düzeltildi — kulübün kendi yazımı budur ve
    // posterde de böyle geçiyor).
    // `slug` KASITLI olarak eski hâlinde bırakıldı: site canlıda ve slug
    // `/kamplar/<slug>` adresini, başvuru formunun `?kamp=` parametresini ve
    // paylaşılmış olabilecek bağlantıları belirliyor. Adı değiştirmek görünen
    // metni günceller; slug'ı değiştirmek çalışan URL'leri kırar. İkisi
    // birbirinden bağımsız ve ayrı kararlar. Aynı gerekçe tarih değişiminde de
    // geçerli: 18-20 Eylül'e kayan tarih slug'ı etkilemez.
    title: { tr: 'Asos Yoga Retreat', en: 'Asos Yoga Retreat' },
    summary: {
      tr: 'Sabah vinyasa, akşam yin. Üç gün boyunca telefonlardan uzakta, zeytinliklerin arasında nefesine dönüyorsun.',
      en: 'Vinyasa in the morning, yin in the evening. Three days away from screens, returning to your breath among olive groves.',
    },
    startDate: '2026-09-18',
    endDate: '2026-09-20',
    nights: 2,
    venueSlug: 'karadut-tas-otel',
    teacherSlugs: ['melike-goktan'],
    capacity: 16,
    spotsLeft: 16,
    priceFrom: 10500,
    // Kullanıcıdan gelen fiyat listesi (2026-09-05), kişi başı TRY.
    priceTiers: [
      { occupancy: 'double', nights: 2, price: 10500 },
      { occupancy: 'single', nights: 2, price: 13500 },
      { occupancy: 'double', nights: 1, price: 6500 },
      { occupancy: 'single', nights: 1, price: 9500 },
    ],
    currency: 'TRY',
    level: 'tum-seviyeler',
    status: 'open',
    heroImage: '/img/venue/hero.webp',
    posterImage: '/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg',
    // Eskiyen `/img/poster.png` ("Rüzgar ve Deniz" duyurusu) yerine bu etkinliğin
    // iki güncel posteri konuldu.
    gallery: [
      '/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg',
      '/img/poster/canakkale-18-20-eylul-2026-kapsam.jpeg',
      '/img/venue/dis-cephe.webp',
      '/img/venue/balkon.webp',
      '/img/venue/hotel.webp',
    ],
    // Bu liste posterdeki "What's Included" bölümünün BİREBİR karşılığıdır
    // (kullanıcı teyidi, 2026-09-05: çelişki hâlinde poster esas alınır).
    // Önceki "günde üç öğün vejetaryen beslenme" maddesi bu yüzden kaldırıldı —
    // pakete yalnızca kahvaltı dahil.
    includes: {
      tr: [
        '2 gece konaklama',
        'Her gün yoga pratiği (toplam 4 seans)',
        '2 atölye',
        'Şef hazırlığı sağlıklı kahvaltı',
        'Sonsuzluk havuzu, özel plaj ve antik Troya alanlarına erişim',
      ],
      en: [
        '2 nights accommodation',
        'Daily yoga practice (4 in total)',
        '2 workshops',
        'Chef-prepared healthy breakfast',
        'Access to infinity pool, private beach & ancient Trojan sites',
      ],
    },
    // Öğle ve akşam yemekleri posterde dahil olanlar arasında SAYILMADIĞI için
    // burada açıkça dışlanır: sessizce atlanması, eski üç öğünlük paketi
    // hatırlayan bir katılımcının yanılmasına yol açardı.
    excludes: {
      tr: ['Ulaşım', 'Öğle ve akşam yemekleri', 'Alkollü içecekler', 'Kişisel masaj ve terapiler', 'Seyahat sigortası'],
      en: ['Transport', 'Lunch and dinner', 'Alcoholic drinks', 'Personal massage and therapies', 'Travel insurance'],
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
      // Öğle ve akşam yemeği pakete dahil değil (bkz. `excludes`), bu yüzden bu
      // iki başlık sağlanan bir öğün İMA ETMEZ: biri serbest bir ara, diğeri
      // paket dışı olduğu açıkça yazılmış ortak bir masa.
      {
        time: '13:00',
        title: { tr: 'Öğle arası ve serbest zaman', en: 'Lunch break and free time' },
        desc: { tr: 'Havuz, kitap, uyku ya da koya yürüyüş.', en: 'Pool, a book, a nap, or a walk to the bay.' },
      },
      {
        time: '17:30',
        title: { tr: 'Akşam yin', en: 'Evening yin' },
        desc: { tr: 'Uzun tutuşlar, destekli pozlar, kapanış meditasyonu.', en: 'Long holds, supported poses, closing meditation.' },
      },
      {
        time: '19:30',
        title: { tr: 'Ortak akşam masası', en: 'Shared evening table' },
        desc: { tr: 'Taş terasta birlikte akşam yemeği; paket dışı.', en: 'Dinner together on the stone terrace; not included in the package.' },
      },
    ],
    featured: true,
  },
]
