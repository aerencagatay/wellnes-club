import type { MetadataRoute } from 'next'
import { site } from '@/lib/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/basvuru-alindi'] }],
    sitemap: `${site.url.replace(/\/+$/, '')}/sitemap.xml`,
  }
}
