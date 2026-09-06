// Ayrı bir dosyaya çıkarıldı ki `navbar.tsx`'i (client-only next-intl/next
// navigation importları taşır, vitest'in node ortamında çözülemez) import
// etmeden bu saf mantık test edilebilsin — bkz. navbar.test.ts.
//
// Bu liste, gerçek tam-taşma KOYU hero'su olan ROTALARI (bileşenleri değil)
// sıralar; yeni bir hero eklendiğinde buraya bir satır eklemek yeterlidir —
// bir sayfanın DOM yapısının kazara bunu bozması artık mümkün değildir.
//
// ANA SAYFA GERİ EKLENDİ (2026-09-05): hero 2026-08-13'te fotoğrafsız/krem
// zeminli tipografik bir açılışa dönüştüğü için listeden çıkarılmıştı (krem
// zemin üzerinde krem navbar görünmez olurdu). Zine yönüyle birlikte hero
// yeniden tam-taşma KOYU bir alan oldu (`.field-forest`, zeytin yeşili), yani
// şeffaf navbar'ın krem metni orada tekrar okunur. Kural değişmedi, hero'nun
// zemini değişti.
//
// /mekan LİSTEDEN ÇIKARILDI çünkü sayfanın kendisi silindi (site üç sayfaya
// indirildi, kullanıcı kararı 2026-09-05).
export const HERO_BACKDROP_ROUTES: RegExp[] = [
  /^\/$/, // ana sayfa — `HeroHome`'un zeytin poster alanı
  /^\/kamplar\/[^/]+$/, // kamp detay sayfası — `CampDetailHero`
]

export function hasHeroBackdropFor(pathname: string): boolean {
  return HERO_BACKDROP_ROUTES.some((pattern) => pattern.test(pathname))
}
