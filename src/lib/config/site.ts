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
 * Navbar'ın ortalanmış gezinme şeridi: yalnızca İKİ madde — Yaklaşan
 * Etkinlikler ve Hakkımızda (kullanıcı kararı, 2026-09-05).
 *
 * `NAV_ITEMS`'in yerini ALMAZ: footer hâlâ tam site haritasını gösterir
 * (hocalar, mekan, deneyim, SSS, iletişim). Buradan çıkarılmış olmak o
 * sayfaların kaldırıldığı anlamına gelmez — yalnızca birincil şeritte
 * durmadıkları anlamına gelir.
 *
 * "Sağlıklı Yaşam" mega menüsü KALDIRILDI: kulüp artık yalnızca yoga /
 * retreat / pilates düzenliyor, dokuz farklı aktivite sayan bir menü
 * yapılmayacak işleri duyuruyordu. Menüyü render eden
 * `layout/wellness-goals-menu.tsx` ve buradaki `WELLNESS_GOALS` listesi de
 * silindi. Bu yüzden maddeler artık `type` ayrımı TAŞIMIYOR — eskiden
 * `'link' | 'menu'` ayrımı vardı çünkü menü maddesi gerçek bir sayfaya
 * gitmiyordu; menü gidince ayrım da anlamsız kaldı ve navbar'daki koşullu
 * dal kalktı.
 */
export const PRIMARY_NAV_ITEMS = [
  { href: '/kamplar', key: 'events' },
  { href: '/hakkimizda', key: 'about' },
] as const

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
