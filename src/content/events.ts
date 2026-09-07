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
 * Gerçek retreat'in programı `camps.ts`'teki `dailyFlow`'dan gelir ve artık
 * GÜN GÜN: Cuma, Cumartesi, Pazar (kullanıcıdan gelen program, 2026-09-07).
 *
 * Önceden tek bir "Günlük Akış" günü olarak sunuluyordu çünkü elimizde güne
 * bölünmüş doğrulanmış bir program yoktu ve üç ayrı gün uydurmak yerine
 * bilinen tek akış gösteriliyordu. Artık gerçek program var, dolayısıyla
 * program modalı da gün sekmeleri gösteriyor.
 */
const realEvent: WellnessEvent = {
  id: REAL_CAMP.slug,
  slug: REAL_CAMP.slug,
  title: REAL_CAMP.title,
  category: 'yoga',
  dateStart: REAL_CAMP.startDate,
  dateEnd: REAL_CAMP.endDate,
  location: { tr: 'Asos, Çanakkale', en: 'Asos, Çanakkale' },
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
  schedule: REAL_CAMP.dailyFlow.map((day) => ({
    day: day.label,
    date: day.date,
    items: day.items.map((item) => ({
      time: item.time,
      title: item.title,
      description: item.desc,
    })),
  })),
  campSlug: REAL_CAMP.slug,
  isPlaceholder: false,
}

/**
 * ÖRNEK KAYITLAR — gerçek etkinlik değildir (yukarıdaki nota bakın).
 * `schedule: []` bilinçlidir: program modalı boş programda "yakında"
 * mesajı gösterir, uydurma bir saat cetveli üretmez.
 *
 * Koşu (Belgrad Ormanı), doğa yürüyüşü (Kazdağları) ve kitap kulübü
 * (Cihangir) örnekleri KALDIRILDI (kullanıcı kararı, 2026-09-05): kulüp
 * yalnızca yoga, retreat ve pilates düzenleyecek. Geriye kalan tek örnek
 * pilates olduğu için duruyor — kategorileri `EventCategory` tipinden de
 * çıkardık, yani bu kayıtları geri getirmek artık tip hatası verir.
 */
const placeholderEvents: WellnessEvent[] = [
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
]

/** Gerçek etkinlik her zaman başta durur; örnekler onu izler. */
export const events: WellnessEvent[] = [realEvent, ...placeholderEvents]
