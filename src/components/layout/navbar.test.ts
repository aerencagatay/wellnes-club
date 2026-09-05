import { describe, expect, it } from 'vitest'
import { hasHeroBackdropFor } from './hero-backdrop-routes'

// Regresyon testi: `hero-backdrop-routes.ts`'teki statik liste, gerçek
// tam-taşma KOYU hero'su olan rotaları elle sıralar. Bu liste güncellenmeden
// yeni bir hero rotası eklenirse ilk-boyamada dark-on-dark (veya krem-üstü-krem)
// navbar hatası SESSİZCE geri döner — bu tam olarak kamp-detay sayfasında
// canlıda yaşanan kusurdu.
describe('hasHeroBackdropFor', () => {
  // Ana sayfa 2026-08-13'te listeden ÇIKARILMIŞTI (hero krem zemine dönmüştü),
  // 2026-09-05'te zine yönüyle birlikte GERİ EKLENDİ: hero yeniden tam-taşma
  // koyu bir zeytin alanı (`.field-forest`). Bu beklenti o kararı kilitler —
  // hero tekrar açık renkli bir zemine dönerse burası kırılmalı.
  it('ana sayfa için true döner — hero zeytin poster alanı', () => {
    expect(hasHeroBackdropFor('/')).toBe(true)
  })

  it('kamp detay sayfası (dinamik slug) için true döner', () => {
    expect(hasHeroBackdropFor('/kamplar/asos-eylul')).toBe(true)
    expect(hasHeroBackdropFor('/kamplar/baska-bir-slug')).toBe(true)
  })

  it('kamplar listesi (hero yok) için false döner — /kamplar/[slug] ile karıştırılmamalı', () => {
    expect(hasHeroBackdropFor('/kamplar')).toBe(false)
  })

  it('hakkımızda ve membership için false döner — ikisi de krem zeminli PageHero kullanır', () => {
    expect(hasHeroBackdropFor('/hakkimizda')).toBe(false)
    expect(hasHeroBackdropFor('/membership')).toBe(false)
  })

  // Silinmiş rotalar geri gelirse listeye eklenmeleri gerektiğini hatırlatır:
  // bugün bunlar 404, dolayısıyla hero'ları da yok.
  it('silinmiş rotalar için false döner', () => {
    expect(hasHeroBackdropFor('/mekan')).toBe(false)
    expect(hasHeroBackdropFor('/hocalar')).toBe(false)
  })
})
