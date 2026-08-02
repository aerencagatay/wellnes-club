import type { MetadataRoute } from 'next'
import { site } from '@/lib/config/site'
import { buildSitemapEntries } from '@/lib/seo/sitemap-entries'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(site.url).map((entry) => ({
    url: entry.url,
    alternates: entry.alternates,
    changeFrequency: 'weekly',
    priority: entry.url.endsWith('/tr') || entry.url.endsWith('/en') ? 1 : 0.7,
  }))
}
