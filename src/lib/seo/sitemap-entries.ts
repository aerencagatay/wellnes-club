import { getAllCamps, getAllPosts, getAllTeachers } from '@/content'
import { routing } from '@/i18n/routing'

/** Dizine girmesi istenen statik yollar. /basvuru-alindi bilinçli olarak yok. */
export const STATIC_PATHS = [
  '',
  '/kamplar',
  '/hocalar',
  '/mekan',
  '/deneyim',
  '/hakkimizda',
  '/sss',
  '/iletisim',
  '/blog',
  '/basvuru',
  '/kvkk',
  '/gizlilik',
] as const

export type SitemapEntry = {
  url: string
  alternates: { languages: Record<string, string> }
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
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
