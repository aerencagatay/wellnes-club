import { describe, expect, it } from 'vitest'
import { getAllCamps, getAllPosts, getAllTeachers } from '@/content'
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

  it('her hocayı iki dilde içerir', () => {
    for (const teacher of getAllTeachers()) {
      expect(urls).toContain(`${SITE}/tr/hocalar/${teacher.slug}`)
      expect(urls).toContain(`${SITE}/en/hocalar/${teacher.slug}`)
    }
  })

  it('beklenen toplam kayıt sayısını üretir', () => {
    // getAllPosts() dahil: /blog listeleme sayfası STATIC_PATHS'te bilinçli olarak
    // yok (bkz. sitemap-entries.ts yorumu), ama tekil yazı yolları her zaman
    // sayılmalı — aksi halde bu test yalnızca posts boşken doğru sonuç verir ve ilk
    // yazı eklendiğinde yanlış nedenle (formül eksikliği, sitemap kodu değil) kırılır.
    const dynamicCount = getAllCamps().length + getAllTeachers().length + getAllPosts().length
    expect(entries).toHaveLength((STATIC_PATHS.length + dynamicCount) * 2)
  })

  it('boş olduğu sürece /blog listeleme sayfasını dışlar', () => {
    expect(urls.some((u) => /\/blog$/.test(u))).toBe(false)
  })

  it('yinelenen URL içermez', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('her kayıt iki dil için hreflang alternatifi taşır', () => {
    for (const entry of entries) {
      expect(Object.keys(entry.alternates.languages).sort()).toEqual(['en', 'tr'])
    }
  })

  it('teşekkür ve başvuru sayfalarını dışlar', () => {
    expect(urls.some((u) => u.includes('/basvuru-alindi'))).toBe(false)
  })

  it('sonunda eğik çizgi olan siteUrl değerinde çift eğik çizgi üretmez', () => {
    for (const url of buildSitemapEntries(`${SITE}/`).map((e) => e.url)) {
      expect(url.replace(`${SITE}/`, '')).not.toMatch(/^\//)
    }
  })
})
