export type Locale = 'tr' | 'en'
export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

/** Anahtar değerlerdir; kullanıcıya görünen etiketler messages/*.json'da. */
export type Program = 'yoga' | 'pilates' | 'yoga-pilates'
export type Level = 'baslangic' | 'tum-seviyeler' | 'ileri'
export type CampStatus = 'open' | 'waitlist' | 'closed'

/** Oda tipi: `double` = 2 kişilik oda (paylaşımlı), `single` = tek kişilik oda. */
export type Occupancy = 'double' | 'single'

/**
 * Kişi başı fiyat kademesi. Bir kampın fiyatı tek bir sayı DEĞİLDİR: oda tipi
 * ve kalınan gece sayısı fiyatı belirler, bu yüzden kademeler ayrı ayrı durur.
 *
 * `CampSession.priceFrom` bunlardan TÜRETİLMEZ ve en düşük kademeye eşit
 * OLMAK ZORUNDA DEĞİLDİR: `priceFrom`, kartlarda ve CTA'da gösterilen *tam
 * program* (tüm geceler, paylaşımlı oda) başlangıç fiyatıdır — tek gecelik
 * kısa katılım daha ucuz olabilir ve bu tabloda görünür. İkisini birbirine
 * eşitlemek, kartta tam programın karşılığı olmayan bir fiyat göstermek olurdu.
 */
export type PriceTier = {
  occupancy: Occupancy
  /** Bu kademenin kapsadığı gece sayısı. */
  nights: number
  /** Kişi başı, TRY. */
  price: number
}

export type DailyFlowItem = {
  time: string // 'HH:MM'
  title: Localized
  desc: Localized
}

export type CampSession = {
  slug: string
  program: Program
  title: Localized
  summary: Localized
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
  nights: number
  venueSlug: string
  teacherSlugs: string[]
  capacity: number
  spotsLeft: number
  priceFrom: number // kişi başı, paylaşımlı oda, tam program
  /** Oda tipi × gece sayısı fiyat kademeleri; kamp detayında tablo olarak gösterilir. */
  priceTiers: PriceTier[]
  currency: 'TRY'
  level: Level
  status: CampStatus
  heroImage: string
  /**
   * Etkinligin duyuru posteri (sosyal medyada paylasilan kare gorsel).
   *
   * `heroImage`'den AYRI bir alandir ve onun yerine gecmez: hero, kamp detay
   * sayfasinin tam-tasma genis bandidir ve kare bir poster orada ust/alt
   * kirpilarak logosunu ve konum satirini kaybederdi. Poster yalnizca kare
   * cerceve kullanan yuzeylerde gosterilir (bkz. `CampCard media="poster"`).
   */
  posterImage?: string
  gallery: string[]
  includes: LocalizedList
  excludes: LocalizedList
  dailyFlow: DailyFlowItem[]
  featured: boolean
}

/**
 * `bio`, `certifications` ve `photo` İSTEĞE BAĞLIDIR ve bu bilinçlidir.
 *
 * Hocalar gerçek kişilerdir: uydurma bir özgeçmiş ya da uydurma bir sertifika
 * listesi yayınlamak, o kişi adına yanlış mesleki beyanda bulunmaktır. Bu üç
 * alan yalnızca kişinin kendisinden doğrulanmış bilgi geldiğinde doldurulur;
 * gelene kadar alan hiç yazılmaz ve arayüz o bölümü render etmez.
 * `photo` için de aynısı geçerli — fotoğraf yoksa `TeacherPortrait` isimden
 * türetilmiş bir monogram gösterir, stok bir fotoğraf koymaz.
 */
export type Teacher = {
  slug: string
  name: string
  title: Localized
  disciplines: Program[]
  bio?: Localized
  certifications?: LocalizedList
  photo?: string
  instagram?: string
}

export type Venue = {
  slug: string
  name: string
  shortDescription: Localized
  location: Localized
  highlights: LocalizedList
  gallery: string[]
  mapEmbedUrl: string
  websiteUrl: string
  coordinates: { lat: number; lng: number }
}

export type FaqItem = {
  id: string
  question: Localized
  answer: Localized
}

export type Testimonial = {
  id: string
  author: string
  campSlug?: string
  quote: Localized
  /** ÖRNEK veri mi? true ise yayına almadan önce değiştirilmeli. */
  isPlaceholder: boolean
}

/**
 * Etkinlik kategorisi; kullanıcıya görünen etiketler messages/*.json →
 * `eventCategory`.
 *
 * `running` / `hiking` / `kayaking` / `bookClub` KALDIRILDI (kullanıcı kararı,
 * 2026-09-05): kulüp artık yalnızca yoga, retreat ve pilates düzenliyor.
 * Kategoriyi tipten çıkarmak bilinçli — yalnızca içerikten silseydik tip hâlâ
 * geçerli sayacağı için birinin ileride farkında olmadan bir koşu etkinliği
 * eklemesini hiçbir şey engellemezdi.
 */
export type EventCategory = 'yoga' | 'pilates' | 'meditation'

export type EventScheduleItem = {
  time: string // 'HH:MM'
  title: Localized
  description?: Localized
}

export type EventScheduleDay = {
  /** Gün etiketi ('Cuma' / 'Friday') — sekme başlığı olarak gösterilir. */
  day: Localized
  date?: string // 'YYYY-MM-DD'
  items: EventScheduleItem[]
}

export type EventMedia = {
  type: 'image' | 'video'
  src: string
  /** `type: 'video'` için zorunlu poster görseli — video asla postersiz yüklenmez. */
  poster?: string
  alt: Localized
}

/**
 * Ana sayfa showcase'i, /kamplar liste sayfası ve program modalı bu tek tipi
 * paylaşır.
 *
 * `isPlaceholder` KRİTİKTİR ve isteğe bağlı değildir: `true` olan kayıtlar
 * gerçek bir etkinliğe karşılık GELMEZ — arayüzde "ÖRNEK / YAKINDA" rozetiyle
 * işaretlenir, fiyat gösterilmez ve rezervasyon CTA'sı pasif kalır. Bu,
 * testimonials.ts'teki aynı konvansiyonun (ve 2026-08-06'da kurgusal etkinlik
 * listesinin kaldırılması kararının) sürdürülmesidir: site canlı bir işletmeye
 * ait olduğu için var olmayan bir etkinliği gerçek fiyat/rezervasyon
 * butonuyla göstermek gerçek müşteriyi yanıltır. Bu yüzden `price` yalnızca
 * `isPlaceholder: false` kayıtlarda anlamlıdır.
 */
export type WellnessEvent = {
  id: string
  slug: string
  title: Localized
  category: EventCategory
  /** `isPlaceholder: true` ise tarih henüz belli değildir ve `undefined` olur. */
  dateStart?: string // 'YYYY-MM-DD'
  dateEnd?: string // 'YYYY-MM-DD'
  location: Localized
  shortDescription: Localized
  /** Kişi başı, TRY. Yalnızca `isPlaceholder: false` kayıtlarda bulunur. */
  price?: number
  currency: 'TRY'
  media: EventMedia
  schedule: EventScheduleDay[]
  /** Gerçek bir kampa bağlıysa `camps.ts` slug'ı — rezervasyon formunu ön-seçer. */
  campSlug?: string
  isPlaceholder: boolean
}

export type BlogPost = {
  slug: string
  title: Localized
  excerpt: Localized
  body: Localized // Markdown
  publishedAt: string // 'YYYY-MM-DD'
  coverImage: string
  tags: string[]
}
