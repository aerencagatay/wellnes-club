import { routing, type AppLocale } from '@/i18n/routing'

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

export function localeToHtmlLang(locale: AppLocale): string {
  return locale === 'tr' ? 'tr-TR' : 'en-GB'
}
