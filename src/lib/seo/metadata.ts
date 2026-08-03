import { routing, type AppLocale } from '@/i18n/routing'
import { LOCALE_TAG } from '@/lib/utils/locale'

/** Her sayfa bu yardımcıyı kullanır; hreflang ve canonical tek yerde tanımlı kalır. */
export function buildAlternates(path: string) {
  return {
    canonical: path,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${stripLocale(path)}`])),
      'x-default': `/${routing.defaultLocale}${stripLocale(path)}`,
    },
  }
}

function stripLocale(path: string): string {
  const match = path.match(/^\/(tr|en)(\/.*)?$/)
  return match ? (match[2] ?? '') : path
}

/**
 * Open Graph `og:locale` biçimi alt çizgi kullanır (`tr_TR`); `<html lang>` içinse ham
 * `locale` değeri (`tr`) zaten yeterlidir — bu yardımcı yalnızca `openGraph.locale`
 * için kullanılır. `LOCALE_TAG`'ın BCP-47 biçiminden (`tr-TR`) türetilir ki tek bir
 * `Record<AppLocale, string>` kaynağı olsun — üçüncü bir locale eklendiğinde bu
 * eşleme otomatik güncellenir, ayrı bir üçlü operatörün eksik kalma riski olmaz.
 *
 * `LOCALE_TAG[locale] ?? ...` fallback'i BİLİNÇLİDİR: eski üçlü operatör
 * (`locale === 'tr' ? ... : 'en_GB'`) her girdi için TOTAL bir fonksiyondu — hiçbir
 * girdide fırlamazdı. Salt `LOCALE_TAG[locale].replace(...)` tip düzeyinde `AppLocale`
 * dışına çıkan bir çağrıda (ör. dış bir kaynaktan gelen doğrulanmamış bir locale
 * dizesi) `undefined.replace`'e çarpıp fırlar. Bu yardımcı da aynı şekilde total
 * kalsın diye varsayılan yerele düşülür.
 */
export function localeToOgLocale(locale: AppLocale): string {
  const tag = LOCALE_TAG[locale] ?? LOCALE_TAG[routing.defaultLocale]
  return tag.replace('-', '_')
}
