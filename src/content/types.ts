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

export type BlogPost = {
  slug: string
  title: Localized
  excerpt: Localized
  body: Localized // Markdown
  publishedAt: string // 'YYYY-MM-DD'
  coverImage: string
  tags: string[]
}
