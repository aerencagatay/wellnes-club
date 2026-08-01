/** YER TUTUCU: telefon, e-posta ve Instagram değerlerini yayın öncesi güncelleyin. */
export const site = {
  name: 'Serenity Retreats',
  tagline: { tr: 'Yoga ve pilates kampları', en: 'Yoga and pilates retreats' },
  email: 'merhaba@serenityretreats.com',
  phone: '+90 000 000 00 00',
  phoneHref: 'tel:+900000000000',
  instagram: 'https://instagram.com/',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const

/** `key` değerleri messages/*.json içindeki nav bölümünün anahtarlarıdır. */
export const NAV_ITEMS = [
  { href: '/kamplar', key: 'camps' },
  { href: '/hocalar', key: 'teachers' },
  { href: '/mekan', key: 'venue' },
  { href: '/deneyim', key: 'experience' },
  { href: '/hakkimizda', key: 'about' },
  { href: '/sss', key: 'faq' },
  { href: '/iletisim', key: 'contact' },
] as const

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
