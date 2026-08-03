import { getAllCamps, getAllPosts, getAllTeachers } from '@/content'
import { routing } from '@/i18n/routing'
import { trimSlash } from '@/lib/utils/locale'

/**
 * Dizine girmesi istenen statik yollar. /basvuru-alindi bilinçli olarak yok.
 *
 * /blog de bilinçli olarak burada değil: `getAllPosts()` şu an boş dizi döndürür,
 * yani /blog boş, sitede hiçbir yerden bağlantı verilmeyen (nav/footer'da yok) ince
 * bir sayfadır. Yeni bir sitenin arama motorlarına böyle bir sayfayı sunması SEO
 * açısından zarar verir. Tekil yazı yolları (`/blog/[slug]`) zaten aşağıda
 * `getAllPosts()`'a koşullu — ilk yazı eklendiğinde otomatik olarak eklenir. /blog
 * listeleme sayfasının kendisini geri eklemek, ilk yazıyı yayınlayacak kişinin
 * ürün kararıdır, bu düzeltmenin kapsamında değildir.
 */
export const STATIC_PATHS = [
  '',
  '/kamplar',
  '/hocalar',
  '/mekan',
  '/deneyim',
  '/hakkimizda',
  '/sss',
  '/iletisim',
  '/basvuru',
  '/kvkk',
  '/gizlilik',
] as const

export type SitemapEntry = {
  url: string
  alternates: { languages: Record<string, string> }
}

export function buildSitemapEntries(siteUrl: string): SitemapEntry[] {
  const base = trimSlash(siteUrl)

  const paths = [
    ...STATIC_PATHS,
    ...getAllCamps().map((camp) => `/kamplar/${camp.slug}`),
    ...getAllTeachers().map((teacher) => `/hocalar/${teacher.slug}`),
    ...getAllPosts().map((post) => `/blog/${post.slug}`),
  ]

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  )
}
