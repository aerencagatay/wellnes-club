import type { AppLocale } from '@/i18n/routing'

const INTL_LOCALE: Record<AppLocale, string> = { tr: 'tr-TR', en: 'en-GB' }

/** Kişi başı fiyatı yerel para birimi biçiminde, ondalıksız gösterir. */
export function formatPrice(amount: number, currency: string, locale: AppLocale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
