import { notFound } from 'next/navigation'

/**
 * next-intl'in bilinen bir tuzağı: kökten hiçbir rotayla eşleşmeyen bir yol (ör.
 * `/tr/olmayan-sayfa`) programatik bir `notFound()` çağrısı OLMADAN istendiğinde,
 * Next.js `[locale]` segmentine hiç inmeden köke özgü, yerel (locale) katmanlarımızdan
 * (dolayısıyla html/body sağlayan `[locale]/layout.tsx`'ten ve Navbar/Footer sağlayan
 * `(public)/layout.tsx`'ten) habersiz genel `__next_builtin__` 404 sayfasını üretir —
 * bu, `not-found.tsx` dosyamızı tamamen atlar.
 *
 * Bu yakalama-hepsi (catch-all) rota, `[locale]` altındaki eşleşmeyen HER yolu
 * karşılar; bu da Next'i `[locale]` ve `(public)` layout'larına inmeye zorlar. Burada
 * atılan `notFound()` çağrısı ARTIK programatiktir, bu yüzden en yakın sınır olan
 * `(public)/not-found.tsx`'e (dolayısıyla Navbar/Footer'a) düzgünce yükselir.
 */
export default function CatchAllPage() {
  notFound()
}
