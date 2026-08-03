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
 */
export function localeToOgLocale(locale: AppLocale): string {
  return LOCALE_TAG[locale].replace('-', '_')
}
