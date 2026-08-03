import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { site } from '@/lib/config/site'
import { trimSlash } from '@/lib/utils/locale'

export default function robots(): MetadataRoute.Robots {
  // localePrefix: 'always' anlamına gelir ki /basvuru-alindi hiçbir zaman tek başına var
  // olmaz — yalnızca /tr/basvuru-alindi ve /en/basvuru-alindi olarak var olur. Disallow bir
  // önek eşleşmesidir, bu yüzden dil öneki olmadan yazılan kural hiçbir gerçek URL'ye denk
  // gelmez ve sessizce hiçbir şey yapmaz. Her dil için ayrı kural üretiyoruz.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', ...routing.locales.map((locale) => `/${locale}/basvuru-alindi`)],
      },
    ],
    sitemap: `${trimSlash(site.url)}/sitemap.xml`,
  }
}
