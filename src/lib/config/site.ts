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

/**
 * Footer'ın site haritası. `PRIMARY_NAV_ITEMS` ile artık AYNI listedir.
 *
 * NEDEN AYNI: 2026-09-05'e kadar footer, navbar'da durmayan sayfaları da
 * (hocalar, mekan, deneyim, SSS, iletişim) listeleyen daha uzun bir haritaydı.
 * O sayfalar kullanıcı kararıyla SİLİNDİ — site üç sayfaya indi — dolayısıyla
 * footer'ın gösterebileceği fazladan bir şey kalmadı.
 *
 * İki sabit yine de AYRI DURUYOR, birleştirilmedi: ikisi farklı sorulara cevap
 * veriyor ("footer neyi listeler" ve "birincil şerit neyi listeler") ve
 * gelecekte yine ayrışabilirler. Tek bir sabite indirmek, footer'a bir
 * bağlantı eklemek isteyen kişiyi istemeden navbar'ı da değiştirmeye
 * zorlardı.
 */
export const NAV_ITEMS = [
  { href: '/kamplar', key: 'events' },
  { href: '/hakkimizda', key: 'about' },
  { href: '/membership', key: 'membership' },
] as const

/**
 * Navbar'ın ortalanmış gezinme şeridi: ÜÇ madde (kullanıcı kararı,
 * 2026-09-05) — Yaklaşan Etkinlikler, Hakkımızda, Membership.
 *
 * "Membership" İngilizce kalır ve Türkçe sürümde de çevrilmez: kulübün üyelik
 * programının adı budur, bir gezinme etiketi değil marka terimidir. Bu yüzden
 * messages/tr.json'daki karşılığı da "Membership"tir.
 *
 * Mega menü YOKTUR ve eklenmeyecektir; "Sağlıklı Yaşam" menüsü daha önce
 * kaldırıldı (kulüp yalnızca yoga/pilates retreat'i düzenliyor, dokuz farklı
 * aktivite sayan bir menü yapılmayacak işleri duyuruyordu).
 */
export const PRIMARY_NAV_ITEMS = NAV_ITEMS

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
