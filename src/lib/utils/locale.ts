import type { AppLocale } from '@/i18n/routing'

/**
 * BCP-47 yerel-bölge etiketi (`Intl.NumberFormat`/`Intl.DateTimeFormat` için). Tek
 * kaynak: eskiden `price.ts` ve `dates.ts` bu haritayı birbirinden bağımsız olarak
 * tanımlıyordu, `metadata.ts` ise Open Graph biçimini (`tr_TR`/`en_GB`) ayrı, dile göre
 * dallanan bir üçlü operatör olarak ifade ediyordu — üçüncü bir locale eklenirse bu
 * üçlü operatör tip düzeyinde hata vermeden sessizce yanlış etiket üretirdi.
 * `Record<AppLocale, string>` burada TEK kez tanımlanır; yeni bir locale eklendiğinde
 * bu satırı güncellemek TypeScript tarafından zorunlu kılınır.
 */
export const LOCALE_TAG: Record<AppLocale, string> = { tr: 'tr-TR', en: 'en-GB' }

/** Sonundaki eğik çizgi(ler)i kaldırır — `${trimSlash(url)}/...` birleştirmelerinde çift `//` üretmez. */
export function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}
