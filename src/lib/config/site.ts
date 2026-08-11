/**
 * `iletisim/page.tsx`, `mekan/page.tsx` ve `venue-preview.tsx` sitenin tek mekanını
 * ayrı ayrı bu literal ile arıyor ve bulunamazsa `notFound()` çağırıyordu — üçü de
 * kendi kopyasını tutuyordu, yani `venues.ts`'te bu slug yeniden adlandırılsaydı üç
 * sayfa da (iletişim dahil, sitenin birincil dönüşüm sayfası) test tarafından
 * yakalanmadan 404 verirdi. Tek kaynak burada; `content.test.ts` bu sabitin
 * `getVenueBySlug` ile çözüldüğünü doğrular.
 */
export const PRIMARY_VENUE_SLUG = 'karadut-tas-otel'

export const site = {
  name: 'EDEN Wellness Club',
  tagline: { tr: 'Yoga ve pilates kampları', en: 'Yoga and pilates retreats' },
  email: 'edenwellnessclub2001@gmail.com',
  phone: '+90 538 048 04 28',
  phoneHref: 'tel:+905380480428',
  instagram: 'https://instagram.com/eden_wellnessclub',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const

/** `key` değerleri messages/*.json içindeki nav bölümünün anahtarlarıdır. Footer'ın tam site haritası için kullanılır. */
export const NAV_ITEMS = [
  { href: '/kamplar', key: 'camps' },
  { href: '/hocalar', key: 'teachers' },
  { href: '/mekan', key: 'venue' },
  { href: '/deneyim', key: 'experience' },
  { href: '/hakkimizda', key: 'about' },
  { href: '/sss', key: 'faq' },
  { href: '/iletisim', key: 'contact' },
] as const

/**
 * Navbar'ın üst şeridi (Luxe Wellness Club referansıyla eşleşen 4 sade madde) —
 * `NAV_ITEMS`'in yerini almaz, footer hâlâ tam site haritasını gösterir (kullanıcı
 * isteği, 2026-08-10). `wellnessGoals` gerçek bir sayfaya gitmez, yalnızca
 * `WellnessGoalsMenu` açılır panelini tetikler.
 */
export const PRIMARY_NAV_ITEMS = [
  { href: '/kamplar', key: 'events' },
  { href: '/blog', key: 'previousEvents' },
  { href: '/hakkimizda', key: 'goal' },
] as const

/**
 * Luxe Wellness Club'ın "Wellness Goals" mega menüsündeki kategori listesi.
 * Henüz karşılık gelen bir sayfa olmadığından (kullanıcı isteği, 2026-08-10)
 * öğeler tıklanamaz — yalnızca görsel bir önizleme.
 */
export const WELLNESS_GOALS = [
  'detoxWeightLoss',
  'fitnessSport',
  'slowTravel',
  'medispasClinics',
  'yogaMeditation',
  'wellnessRetreats',
  'antiAgingLongevity',
  'stressManagement',
  'mentalHealth',
  'ayurveda',
  'luxurySpas',
] as const

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
