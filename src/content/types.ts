export type Locale = 'tr' | 'en'
export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

/** Anahtar değerlerdir; kullanıcıya görünen etiketler messages/*.json'da. */
export type Program = 'yoga' | 'pilates' | 'yoga-pilates'
export type Level = 'baslangic' | 'tum-seviyeler' | 'ileri'
export type CampStatus = 'open' | 'waitlist' | 'closed'

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
  priceFrom: number // kişi başı, paylaşımlı oda
  currency: 'TRY'
  level: Level
  status: CampStatus
  heroImage: string
  gallery: string[]
  includes: LocalizedList
  excludes: LocalizedList
  dailyFlow: DailyFlowItem[]
  featured: boolean
}

export type Teacher = {
  slug: string
  name: string
  title: Localized
  disciplines: Program[]
  bio: Localized
  certifications: LocalizedList
  photo: string
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

/** Etkinlik kategorisi; kullanıcıya görünen etiketler messages/*.json → `eventCategory`. */
export type EventCategory =
  | 'yoga'
  | 'pilates'
  | 'running'
  | 'hiking'
  | 'kayaking'
  | 'bookClub'
  | 'meditation'

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
