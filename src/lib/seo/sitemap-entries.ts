import { getAllCamps } from '@/content'
import { routing } from '@/i18n/routing'
import { trimSlash } from '@/lib/utils/locale'

/**
 * Dizine girmesi istenen statik yollar.
 *
 * /basvuru-alindi bilinçli olarak yok (teşekkür sayfası dizine girmemeli).
 *
 * /hocalar, /mekan, /deneyim, /sss, /iletisim ve /blog 2026-09-05'te
 * SİLİNDİ (kullanıcı kararı: site üç sayfaya indirildi). Bu yüzden hem buradan
 * hem de aşağıdaki dinamik yollardan çıkarıldılar — var olmayan bir yolu
 * sitemap'te bırakmak arama motorlarına 404 sunmak olurdu.
 *
 * /membership dizine GİRER: üyelik henüz açık olmasa da sayfa gerçek içerik
 * (başvuru formu) taşır ve navbar'dan bağlantılıdır.
 */
export const STATIC_PATHS = [
  '',
  '/kamplar',
  '/hakkimizda',
  '/membership',
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

  const paths = [...STATIC_PATHS, ...getAllCamps().map((camp) => `/kamplar/${camp.slug}`)]

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  )
}
