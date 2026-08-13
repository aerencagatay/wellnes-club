// Ayrı bir dosyaya çıkarıldı ki `navbar.tsx`'i (client-only next-intl/next
// navigation importları taşır, vitest'in node ortamında çözülemez) import
// etmeden bu saf mantık test edilebilsin — bkz. navbar.test.ts.
//
// Bu liste, gerçek tam-taşma koyu hero'su olan ROTALARI (bileşenleri değil)
// sıralar; yeni bir hero eklendiğinde buraya bir satır eklemek yeterlidir —
// bir sayfanın DOM yapısının kazara bunu bozması artık mümkün değildir.
// ANA SAYFA BİLEREK LİSTEDE DEĞİL (2026-08-13): hero artık fotoğrafsız ve krem
// zeminli tipografik bir açılış. Şeffaf varyant `text-background` (krem) metin
// kullandığı için ana sayfa listede kalsaydı marka adı ve menü krem zemin
// üzerinde görünmez olurdu.
export const HERO_BACKDROP_ROUTES: RegExp[] = [
  /^\/kamplar\/[^/]+$/, // kamp detay sayfası — `CampDetailHero`
  /^\/mekan$/, // mekan sayfası — `PageHero`'nun görsel varyantı
]

export function hasHeroBackdropFor(pathname: string): boolean {
  return HERO_BACKDROP_ROUTES.some((pattern) => pattern.test(pathname))
}
