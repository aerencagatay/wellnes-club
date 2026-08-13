import type { WellnessEvent } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { formatDateRange } from '@/lib/utils/dates'
import { formatPrice } from '@/lib/utils/price'

/**
 * Etkinlik kartı (ana sayfa showcase'i) ve etkinlik satırı (/kamplar) aynı üç
 * sunum kararını paylaşır. Tek yerde durmaları, ÖRNEK kayıtların iki farklı
 * ekranda farklı davranmasını (birinde fiyat gizli, diğerinde açık gibi) baştan
 * imkânsız kılar — bkz. events.ts başlığındaki not.
 */

/** Tarih aralığı; tarih henüz yoksa `fallback` (ör. "Tarih yakında"). */
export function formatEventDate(event: WellnessEvent, locale: AppLocale, fallback: string): string {
  if (!event.dateStart) return fallback
  return formatDateRange(event.dateStart, event.dateEnd ?? event.dateStart, locale)
}

/** Kişi başı fiyat; fiyat henüz yoksa `fallback` (ör. "Ücret yakında"). */
export function formatEventPrice(event: WellnessEvent, locale: AppLocale, fallback: string): string {
  if (event.price === undefined) return fallback
  return formatPrice(event.price, event.currency, locale)
}

/**
 * Rezervasyon hedefi. ÖRNEK kayıtlar için `undefined` döner — çağıran taraf bu
 * durumda CTA'yı `disabled` bir `<button>` olarak render ETMELİDİR, gerçek bir
 * bağlantı olarak değil. Var olmayan bir etkinliğe rezervasyon formu açmak,
 * gerçek müşteriyi yanıltır.
 *
 * Gerçek kayıtta hedef, sitede ZATEN çalışan başvuru formudur: `?kamp=` sorgu
 * parametresi formdaki kamp seçimini önceden doldurur (bkz. basvuru/page.tsx).
 */
export function getReservationHref(event: WellnessEvent): string | undefined {
  if (event.isPlaceholder || !event.campSlug) return undefined
  return `/basvuru?kamp=${event.campSlug}`
}
