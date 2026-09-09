import type { CampSession } from './types'

/**
 * GERÇEK VERİ (kullanıcı onayı, 2026-09-05): tarih 18-20 Eylül 2026, kontenjan
 * 16 kişi. Etkinliğin duyuru posterleriyle eşleşir:
 * `public/img/poster/canakkale-18-20-eylul-2026-*.jpeg`.
 *
 * Tarih 11-13 Eylül'den 18-20 Eylül'e KAYDI (aynı etkinlik, yeni tarih —
 * kullanıcı teyidi, 2026-09-05); ikinci bir kamp açılmadı.
 *
 * Fiyat tek sayı değil, dört kademe (`priceTiers`): oda tipi × gece sayısı.
 *
 * `priceFrom` EN DÜŞÜK kademedir — 6.500 TL (1 gece, paylaşımlı oda). Bir ara
 * 10.500'de (tam program) tutuluyordu; kullanıcı 2026-09-07'de kartlarda
 * 6.500'den başlayan fiyatın görünmesini istedi.
 *
 * YANILTMIYOR ÇÜNKÜ SUNUM "BAŞLANGIÇ" DİYOR: kart ve CTA bu sayıyı
 * `camp.priceFromSuffix` ("kişi başı başlangıç fiyatı" / "per person, from")
 * ile birlikte gösteriyor, ve tam tablo kamp detayında dört kademeyi de
 * açıkça listeliyor. Son ekini kaldıran biri bu sayıyı tek fiyatmış gibi
 * göstermiş olur.
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
    priceFrom: 6500,
    // Kullanıcıdan gelen fiyat listesi (2026-09-05, tek kişilik/2 gece
    // kademesi 2026-09-11'de 13.500 → 14.500 olarak güncellendi), kişi başı TRY.
    priceTiers: [
      { occupancy: 'double', nights: 2, price: 10500 },
      { occupancy: 'single', nights: 2, price: 14500 },
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
     * ÜÇ GÜNLÜK PROGRAM — kullanıcıdan geldiği gibi (2026-09-07), seans
     * başlıkları ve açıklamaları 2026-09-09'da güncellendi.
     *
     * Kullanıcı bu turda dört seans için başlık + açıklama verdi ("18 Eylül",
     * "19 Eylül Sabahı", "19 Eylül Akşamı", "20 Eylül Sabahı") ve saatlere göre
     * yerleştirmeyi bize bıraktı. Her biri var olan bir yoga saatinin YERİNE
     * geçti (saat sabit kaldı, yalnızca başlık/açıklama değişti) — kullanıcı
     * saat vermediği için var olan saat cetveli değiştirilmedi.
     *
     * "SABAH SAYFALARI" AYRI BİR MADDE: cumartesi ve pazar sabahı bloklarında
     * yoga açıklamasından SONRA gelen ikinci satır ("Sabah sayfalarıyla...")
     * farklı bir aktiviteye (yazı egzersizi) ait, aynı seansın devamı değil —
     * bu yüzden kendi saatiyle ayrı bir madde oldu, yoga açıklamasına eklenmedi.
     * Saati verilmediği için yoga ile kahvaltı arasına (10:00) yerleştirildi.
     *
     * AKŞAM YEMEĞİ SATIRLARINDA AÇIKLAMA YOK — bilinçli (kullanıcı kararı,
     * 2026-09-07). Yemeğin ücreti pakete dahil değil ve kulüp bunu soranlara
     * kendisi söylüyor; programda tekrarlanmasını istemedi.
     *
     * BİLGİ SİTEDE KAYBOLMUYOR: `excludes` listesi "Öğle ve akşam yemekleri"ni
     * paket dışı sayıyor ve kamp detayında "Dahil Değil" başlığı altında,
     * fiyat tablosunun hemen üstünde görünüyor. Yani beyan ait olduğu yerde
     * duruyor, program da saat cetveli olarak sade kalıyor.
     */
    dailyFlow: [
      {
        label: { tr: 'Cuma', en: 'Friday' },
        date: '2026-09-18',
        items: [
          { time: '17:00', title: { tr: 'Varış & yerleşme', en: 'Arrival & settling in' } },
          {
            time: '19:00',
            title: { tr: 'Açılış ve Tanışma', en: 'Opening & Meet-and-Greet' },
            desc: {
              tr: 'Yoga, nefes ve meditasyon — zihnini yavaşlat, bedenini rahatlat.',
              en: 'Yoga, breath and meditation — slow your mind, relax your body.',
            },
          },
          { time: '20:30', title: { tr: 'Akşam yemeği', en: 'Dinner' } },
        ],
      },
      {
        label: { tr: 'Cumartesi', en: 'Saturday' },
        date: '2026-09-19',
        items: [
          {
            time: '09:00',
            title: { tr: 'Güne Enerjik Bir Başlangıç', en: 'An Energetic Start to the Day' },
            desc: {
              tr: 'Enerji veren yoga akışı, nefes ve meditasyon pratiği.',
              en: 'An energising yoga flow, breathwork and meditation practice.',
            },
          },
          {
            time: '10:00',
            title: { tr: 'Sabah Sayfaları', en: 'Morning Pages' },
            desc: {
              tr: 'Sabah sayfalarıyla düşüncelerini yazıya dök.',
              en: 'Put your thoughts on paper with morning pages.',
            },
          },
          { time: '10:30', title: { tr: 'Kahvaltı', en: 'Breakfast' } },
          { time: '12:00', title: { tr: 'Workshop', en: 'Workshop' } },
          { time: '13:30', title: { tr: 'Serbest zaman', en: 'Free time' } },
          {
            time: '18:30',
            title: { tr: 'Gün Batımında İçe Dönüş', en: 'Turning Inward at Sunset' },
            desc: {
              tr: 'Gün batımında yoga akışı, derin esnemeler, nefes ve meditasyon — sinir sistemini rahatlat.',
              en: 'A sunset yoga flow, deep stretches, breath and meditation — calming the nervous system.',
            },
          },
          { time: '20:00', title: { tr: 'Akşam yemeği', en: 'Dinner' } },
        ],
      },
      {
        label: { tr: 'Pazar', en: 'Sunday' },
        date: '2026-09-20',
        items: [
          {
            time: '09:00',
            title: { tr: 'Güne Yumuşak Bir Başlangıç', en: 'A Gentle Start to the Day' },
            desc: {
              tr: 'Nazik bir yoga akışı, nefes ve meditasyon.',
              en: 'A gentle yoga flow, breath and meditation.',
            },
          },
          {
            time: '10:00',
            title: { tr: 'Sabah Sayfaları', en: 'Morning Pages' },
            desc: {
              tr: 'Sabah sayfalarıyla farkındalığını arttır.',
              en: 'Deepen your awareness with morning pages.',
            },
          },
          { time: '10:30', title: { tr: 'Kahvaltı', en: 'Breakfast' } },
          { time: '12:00', title: { tr: 'Workshop', en: 'Workshop' } },
          { time: '13:30', title: { tr: 'Kapanış & vedalaşma', en: 'Closing & goodbyes' } },
        ],
      },
    ],
    featured: true,
  },
]
