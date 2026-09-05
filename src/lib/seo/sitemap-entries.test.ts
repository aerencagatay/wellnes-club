import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { buildSitemapEntries, STATIC_PATHS } from './sitemap-entries'

const SITE = 'https://serenityretreats.com'
const entries = buildSitemapEntries(SITE)
const urls = entries.map((e) => e.url)

describe('buildSitemapEntries', () => {
  it('her statik yolu iki dilde içerir', () => {
    for (const path of STATIC_PATHS) {
      expect(urls, `tr${path}`).toContain(`${SITE}/tr${path}`)
      expect(urls, `en${path}`).toContain(`${SITE}/en${path}`)
    }
  })

  it('her kampı iki dilde içerir', () => {
    for (const camp of getAllCamps()) {
      expect(urls).toContain(`${SITE}/tr/kamplar/${camp.slug}`)
      expect(urls).toContain(`${SITE}/en/kamplar/${camp.slug}`)
    }
  })

  it('beklenen toplam kayıt sayısını üretir', () => {
    // Tek dinamik yol ailesi kamplardır. /hocalar ve /blog 2026-09-05'te
    // silindi (site üç sayfaya indi), bu yüzden formülden de çıkarıldılar.
    expect(entries).toHaveLength((STATIC_PATHS.length + getAllCamps().length) * 2)
  })

  /**
   * Silinen sayfaların yolları sitemap'e SIZMAMALIDIR. İçerik katmanı
   * (`teachers.ts`, `posts.ts`) hâlâ duruyor — kamp detay sayfası hocaları
   * gösterdiği için `teachers.ts` silinmedi — dolayısıyla birinin ileride
   * `getAllTeachers()`'ı sitemap'e geri eklemesi teknik olarak mümkün. Bu test
   * o hatayı yakalar: veri var diye SAYFA var demek değildir; olmayan bir yolu
   * sitemap'te sunmak arama motorlarına 404 vaat etmektir.
   */
  it('silinmiş sayfaların yollarını içermez', () => {
    for (const segment of ['/hocalar', '/mekan', '/deneyim', '/sss', '/iletisim', '/blog']) {
      expect(
        urls.filter((u) => u.includes(segment)),
        `${segment} sitemap'te görünüyor ama sayfa silindi`,
      ).toEqual([])
    }
  })

  it('yinelenen URL içermez', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('her kayıt iki dil için hreflang alternatifi taşır', () => {
    for (const entry of entries) {
      expect(Object.keys(entry.alternates.languages).sort()).toEqual(['en', 'tr'])
    }
  })

  it('teşekkür sayfasını dışlar', () => {
    expect(urls.some((u) => u.includes('/basvuru-alindi'))).toBe(false)
  })

  it('membership sayfasını içerir', () => {
    expect(urls).toContain(`${SITE}/tr/membership`)
    expect(urls).toContain(`${SITE}/en/membership`)
  })

  it('sonunda eğik çizgi olan siteUrl değerinde çift eğik çizgi üretmez', () => {
    for (const url of buildSitemapEntries(`${SITE}/`).map((e) => e.url)) {
      expect(url.replace(`${SITE}/`, '')).not.toMatch(/^\//)
    }
  })
})
