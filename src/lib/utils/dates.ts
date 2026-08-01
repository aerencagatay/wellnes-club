import type { AppLocale } from '@/i18n/routing'

const INTL_LOCALE: Record<AppLocale, string> = { tr: 'tr-TR', en: 'en-GB' }
const EN_DASH = '–'

/** 'YYYY-MM-DD' dizesini yerel saat diliminden bağımsız olarak parçalar. */
function parts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

function monthName(date: string, locale: AppLocale): string {
  const { year, month, day } = parts(date)
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, day)),
  )
}

export function formatDateLong(date: string, locale: AppLocale): string {
  const { day, year } = parts(date)
  return `${day} ${monthName(date, locale)} ${year}`
}

export function formatDateRange(startDate: string, endDate: string, locale: AppLocale): string {
  const start = parts(startDate)
  const end = parts(endDate)

  if (startDate === endDate) return formatDateLong(startDate, locale)

  if (start.year !== end.year) {
    return `${formatDateLong(startDate, locale)} ${EN_DASH} ${formatDateLong(endDate, locale)}`
  }

  if (start.month !== end.month) {
    return `${start.day} ${monthName(startDate, locale)} ${EN_DASH} ${end.day} ${monthName(endDate, locale)} ${end.year}`
  }

  // Aynı ay: ayı bir kez yaz, gün aralığını boşluksuz en-dash ile bağla
  return `${start.day}${EN_DASH}${end.day} ${monthName(startDate, locale)} ${end.year}`
}
