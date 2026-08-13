import { describe, expect, it } from 'vitest'
import { hasHeroBackdropFor } from './hero-backdrop-routes'

// Regresyon testi (Task 4'ten devredildi, bkz. progress.md): navbar.tsx'teki
// HERO_BACKDROP_ROUTES statik listesi, gerçek tam-taşma koyu hero'su olan
// rotaları elle sıralar. Bu liste güncellenmeden yeni bir hero rotası
// eklenirse ilk-boyamada dark-on-dark navbar hatası SESSİZCE geri döner (bu
// tam olarak kamp-detay sayfasında canlıda yaşanan kusurdu). Bu test o üç
// rotanın hâlâ `true` döndüğünü ve bilinen heroless bir rotanın `false`
// döndüğünü doğrular.
describe('hasHeroBackdropFor', () => {
  // Ana sayfanın hero'su fotoğrafsız/krem zemine dönüştüğünde (2026-08-13)
  // listeden çıkarıldı: şeffaf varyant krem metin kullanır, krem zemin üzerinde
  // navbar tamamen görünmez olurdu. Bu beklenti o kararı kilitler.
  it('ana sayfa için false döner — hero artık açık renkli, şeffaf navbar okunmaz', () => {
    expect(hasHeroBackdropFor('/')).toBe(false)
  })

  it('kamp detay sayfası (dinamik slug) için true döner', () => {
    expect(hasHeroBackdropFor('/kamplar/assos-eylul')).toBe(true)
    expect(hasHeroBackdropFor('/kamplar/baska-bir-slug')).toBe(true)
  })

  it('mekan sayfası için true döner', () => {
    expect(hasHeroBackdropFor('/mekan')).toBe(true)
  })

  it('kamplar listesi (hero yok) için false döner — /kamplar/[slug] ile karıştırılmamalı', () => {
    expect(hasHeroBackdropFor('/kamplar')).toBe(false)
  })

  it('bilinen heroless bir rota (/hocalar) için false döner', () => {
    expect(hasHeroBackdropFor('/hocalar')).toBe(false)
  })
})
