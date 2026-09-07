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
    /**
     * ÜÇ GÜNLÜK PROGRAM — kullanıcıdan geldiği gibi (2026-09-07).
     *
     * Önceki hâli tek bir "tipik gün"dü çünkü güne bölünmüş doğrulanmış bir
     * program yoktu. Artık var; uydurma açıklama EKLENMEDİ — satırlar yalnızca
     * saat ve başlıktan ibaret, çünkü verilen program da öyle.
     *
     * AKŞAM YEMEĞİ SATIRLARI — SAAT PROGRAMDA, ÜCRET PAKETTE DEĞİL.
     *
     * `excludes` "Öğle ve akşam yemekleri"ni paket dışı sayar ve bu DOĞRUDUR
     * (kullanıcı teyidi, 2026-09-07): kulüp o saati toplu yemek için ayırmış
     * ama yemeğin ücreti fiyata dahil değil. Tek başına "Akşam yemeği" yazmak
     * sağlanan bir öğün İMA EDERDİ — katılımcı için doğrudan para demek. Bu
     * yüzden iki satırın `desc` alanı durumu açıkça yazıyor.
     *
     * KAHVALTI'da böyle bir not YOK ve olmamalı: kahvaltı `includes` listesinde
     * ("Şef hazırlığı sağlıklı kahvaltı"), yani gerçekten pakete dahil.
     */
    dailyFlow: [
      {
        label: { tr: 'Cuma', en: 'Friday' },
        date: '2026-09-18',
        items: [
          { time: '17:00', title: { tr: 'Varış & yerleşme', en: 'Arrival & settling in' } },
          { time: '19:00', title: { tr: 'Akşam yoga akışı', en: 'Evening yoga flow' } },
          {
            time: '20:30',
            title: { tr: 'Akşam yemeği', en: 'Dinner' },
            desc: {
              tr: 'Toplu masa için ayrılmış saat; yemek ücreti pakete dahil değildir.',
              en: 'Time set aside to eat together; the meal itself is not included in the price.',
            },
          },
        ],
      },
      {
        label: { tr: 'Cumartesi', en: 'Saturday' },
        date: '2026-09-19',
        items: [
          { time: '09:00', title: { tr: 'Sabah yoga pratiği', en: 'Morning yoga practice' } },
          { time: '10:30', title: { tr: 'Kahvaltı', en: 'Breakfast' } },
          { time: '12:00', title: { tr: 'Workshop', en: 'Workshop' } },
          { time: '13:30', title: { tr: 'Serbest zaman', en: 'Free time' } },
          { time: '18:30', title: { tr: 'Gün batımı yogası', en: 'Sunset yoga' } },
          {
            time: '20:00',
            title: { tr: 'Akşam yemeği', en: 'Dinner' },
            desc: {
              tr: 'Toplu masa için ayrılmış saat; yemek ücreti pakete dahil değildir.',
              en: 'Time set aside to eat together; the meal itself is not included in the price.',
            },
          },
        ],
      },
      {
        label: { tr: 'Pazar', en: 'Sunday' },
        date: '2026-09-20',
        items: [
          { time: '09:00', title: { tr: 'Sabah yoga pratiği', en: 'Morning yoga practice' } },
          { time: '10:30', title: { tr: 'Kahvaltı', en: 'Breakfast' } },
          { time: '12:00', title: { tr: 'Workshop', en: 'Workshop' } },
          { time: '13:30', title: { tr: 'Kapanış & vedalaşma', en: 'Closing & goodbyes' } },
        ],
      },
    ],
    featured: true,
  },
]
