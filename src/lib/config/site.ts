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
 * Navbar'ın ortalanmış gezinme şeridi: yalnızca 3 madde (kullanıcı isteği,
 * 2026-08-13). `NAV_ITEMS`'in yerini almaz — footer hâlâ tam site haritasını
 * gösterir; "Geçmiş Etkinlikler" birincil navdan çıkarıldı çünkü artık ana
 * sayfadaki galeri bölümü olarak yaşıyor.
 *
 * Sıra BURADA bildirilir (navbar'da elle "index === 0" gibi bir yerleştirme
 * yok): `menu` tipindeki madde gerçek bir sayfaya gitmez, `WellnessGoalsMenu`
 * panelini tetikler. Üçüncü maddenin etiketi tek yerden değişsin diye
 * `key`/`href` çifti burada durur — yeniden adlandırmak için messages'taki
 * `nav.<key>` değerini değiştirmek yeterli.
 */
export const PRIMARY_NAV_ITEMS = [
  { type: 'link', href: '/kamplar', key: 'events' },
  { type: 'menu', key: 'wellnessGoals' },
  { type: 'link', href: '/hakkimizda', key: 'about' },
] as const

/**
 * "Sağlıklı Yaşam" mega menüsündeki pratik listesi — EDEN'in kamplarında
 * gerçekten yapılan aktiviteler (kullanıcı isteği, 2026-08-13; önceki jenerik
 * "wellness goals" listesinin yerini aldı). Henüz karşılık gelen bir sayfa
 * olmadığından öğeler tıklanamaz; menü bunu görsel olarak da belirtir.
 */
export const WELLNESS_GOALS = [
  'yogaPilates',
  'hiking',
  'running',
  'canoeing',
  'reading',
  'meditationBreathwork',
  'cycling',
  'swimming',
  'wellnessRetreats',
] as const

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
