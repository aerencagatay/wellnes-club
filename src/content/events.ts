import { camps } from './camps'
import type { WellnessEvent } from './types'

/**
 * ============================================================
 * BU DOSYADA İKİ TÜR KAYIT VAR:
 *
 *   1. GERÇEK etkinlik (`isPlaceholder: false`) — tarih, fiyat ve program
 *      bilgisi `camps.ts`'ten TÜRETİLİR, burada elle tekrarlanmaz. Böylece
 *      fiyat/tarih tek bir yerde (camps.ts) yaşar ve iki yerde ayrışamaz.
 *
 *   2. ÖRNEK etkinlik (`isPlaceholder: true`) — HENÜZ VAR OLMAYAN, tasarım
 *      sistemini doldurmak için duran kayıtlar. Arayüzde "ÖRNEK" rozetiyle
 *      gösterilir, fiyatı ve rezervasyon butonu YOKTUR. Gerçek etkinlik
 *      planlandığında: tarih/fiyat/program eklenip `isPlaceholder` alanı
 *      `false` yapılır ve rozet kendiliğinden kaybolur.
 *
 * Görseller mevcut mekan setinden (public/img/venue) yeniden kullanılır —
 * bunlar otelin gerçek fotoğraflarıdır, faaliyetin kendisinin değil; birer
 * atmosfer görseli olarak durur. Uydurma bir dosya yolu icat EDİLMEZ.
 * ============================================================
 */

const REAL_CAMP = camps[0]

/**
 * Gerçek retreat'in programı `camps.ts`'teki `dailyFlow`'dan gelir. Kasıtlı
 * olarak TEK bir "tipik gün" olarak sunulur: elimizde günü güne ayrılmış
 * (Cuma/Cumartesi/Pazar) doğrulanmış bir program yok, dolayısıyla üç ayrı gün
 * uydurmak yerine gerçekte bilinen akış gösterilir.
 */
const realEvent: WellnessEvent = {
  id: REAL_CAMP.slug,
  slug: REAL_CAMP.slug,
  title: REAL_CAMP.title,
  category: 'yoga',
  dateStart: REAL_CAMP.startDate,
  dateEnd: REAL_CAMP.endDate,
  location: { tr: 'Assos, Çanakkale', en: 'Assos, Çanakkale' },
  shortDescription: REAL_CAMP.summary,
  price: REAL_CAMP.priceFrom,
  currency: 'TRY',
  // Etkinlik kartının görseli KASITLI olarak `REAL_CAMP.heroImage`'dan
  // TÜRETİLMİYOR (tarih/fiyat/program türetiliyor, bu türetilmiyor). İkisi
  // farklı işler görüyor: kamp detay sayfasının hero'su tam-taşma geniş bir
  // mekan fotoğrafı, kart görseli ise faaliyetin kendisini gösteren dikey bir
  // kare. Aynı dosyayı ikisinde kullanmak, portre bir fotoğrafı geniş hero'da
  // ağır kırpmak (veya geniş bir manzarayı dikey kartta sıkıştırmak) demekti.
  media: {
    type: 'image',
    src: '/img/yoga retreat.jpg',
    alt: {
      tr: 'Ahşap bir platformda gölgeliğin altında yoga pratiği yapan grup',
      en: 'A group practising yoga on a wooden deck under a shade canopy',
    },
  },
  schedule: [
    {
      day: { tr: 'Günlük Akış', en: 'Daily Flow' },
      items: REAL_CAMP.dailyFlow.map((item) => ({
        time: item.time,
        title: item.title,
        description: item.desc,
      })),
    },
  ],
  campSlug: REAL_CAMP.slug,
  isPlaceholder: false,
}

/**
 * ÖRNEK KAYITLAR — gerçek etkinlik değildir (yukarıdaki nota bakın).
 * `schedule: []` bilinçlidir: program modalı boş programda "yakında"
 * mesajı gösterir, uydurma bir saat cetveli üretmez.
 */
const placeholderEvents: WellnessEvent[] = [
  {
    id: 'belgrad-ormani-kosu',
    slug: 'belgrad-ormani-kosu',
    title: { tr: 'Belgrad Ormanı Hafta Sonu Koşusu', en: 'Belgrad Forest Weekend Run' },
    category: 'running',
    location: { tr: 'Belgrad Ormanı, İstanbul', en: 'Belgrad Forest, Istanbul' },
    shortDescription: {
      tr: 'Sabah ışığında orman patikalarında sakin bir grup koşusu, ardından ortak kahve.',
      en: 'An easy group run on forest trails in the morning light, followed by coffee together.',
    },
    currency: 'TRY',
    media: {
      type: 'image',
      src: '/img/forest running.jpg',
      alt: {
        tr: 'Orman patikasında birlikte koşan bir grup',
        en: 'A group running together along a forest trail',
      },
    },
    schedule: [],
    isPlaceholder: true,
  },
  {
    id: 'bogazda-pilates',
    slug: 'bogazda-pilates',
    title: { tr: 'İstanbul Boğazı’nda Pilates', en: 'Pilates on the Bosphorus' },
    category: 'pilates',
    location: { tr: 'Boğaz, İstanbul', en: 'The Bosphorus, Istanbul' },
    shortDescription: {
      tr: 'Suya bakan bir terasta mat pilates seansı; gün doğumuna açılan bir hafta içi sabahı.',
      en: 'A mat pilates session on a terrace over the water, opening a weekday morning.',
    },
    currency: 'TRY',
    media: {
      type: 'image',
      src: '/img/boğazda yoga.jpg',
      alt: {
        tr: 'Boğaz’da bir teknenin güvertesinde kalabalık bir grup pratiği',
        en: 'A large group practising on a boat deck on the Bosphorus',
      },
    },
    schedule: [],
    isPlaceholder: true,
  },
  {
    id: 'cihangir-kitap-bulusmasi',
    slug: 'cihangir-kitap-bulusmasi',
    title: { tr: 'Cihangir’de Kitap Okuma Buluşması', en: 'Cihangir Reading Meetup' },
    category: 'bookClub',
    location: { tr: 'Cihangir, İstanbul', en: 'Cihangir, Istanbul' },
    shortDescription: {
      tr: 'Telefonlar kapalı, iki saat sessiz okuma ve ardından serbest sohbet.',
      en: 'Phones away, two hours of quiet reading, then conversation.',
    },
    currency: 'TRY',
    media: {
      type: 'image',
      src: '/img/kitab klübü.jpg',
      alt: {
        tr: 'Kitaplar ve kahvelerle dolu bir masanın çevresinde oturan grup',
        en: 'A group seated around a table covered with books and coffees',
      },
    },
    schedule: [],
    isPlaceholder: true,
  },
  {
    id: 'kazdaglari-hiking',
    slug: 'kazdaglari-hiking',
    title: { tr: 'Kazdağları Hiking Weekend', en: 'Kazdağları Hiking Weekend' },
    category: 'hiking',
    location: { tr: 'Kazdağları, Balıkesir', en: 'Kazdağları, Balıkesir' },
    shortDescription: {
      tr: 'İki gün boyunca rehberli patika yürüyüşleri, ortak masa ve dağ havası.',
      en: 'Two days of guided trail walks, shared meals and mountain air.',
    },
    currency: 'TRY',
    media: {
      type: 'image',
      src: '/img/kazdağları hike.jpg',
      alt: {
        tr: 'Sırt çantalı üç yürüyüşçü dağ sırtındaki patikada',
        en: 'Three hikers with backpacks on a ridge trail',
      },
    },
    schedule: [],
    isPlaceholder: true,
  },
]

/** Gerçek etkinlik her zaman başta durur; örnekler onu izler. */
export const events: WellnessEvent[] = [realEvent, ...placeholderEvents]
