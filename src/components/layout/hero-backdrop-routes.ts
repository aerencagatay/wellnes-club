// Ayrı bir dosyaya çıkarıldı ki `navbar.tsx`'i (client-only next-intl/next
// navigation importları taşır, vitest'in node ortamında çözülemez) import
// etmeden bu saf mantık test edilebilsin — bkz. navbar.test.ts.
//
// Bu liste, gerçek tam-taşma koyu hero'su olan ROTALARI (bileşenleri değil)
// sıralar; yeni bir hero eklendiğinde buraya bir satır eklemek yeterlidir —
// bir sayfanın DOM yapısının kazara bunu bozması artık mümkün değildir.
export const HERO_BACKDROP_ROUTES: RegExp[] = [
  /^\/$/, // ana sayfa — `HeroHome` (tam ekran koyu hero fotoğrafı)
  /^\/kamplar\/[^/]+$/, // kamp detay sayfası — `CampDetailHero`
  /^\/mekan$/, // mekan sayfası — `PageHero`'nun görsel varyantı
]

export function hasHeroBackdropFor(pathname: string): boolean {
  return HERO_BACKDROP_ROUTES.some((pattern) => pattern.test(pathname))
}
