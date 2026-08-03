import type { AppLocale } from '@/i18n/routing'
import { LOCALE_TAG } from '@/lib/utils/locale'

/** Kişi başı fiyatı yerel para birimi biçiminde, ondalıksız gösterir. */
export function formatPrice(amount: number, currency: string, locale: AppLocale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
