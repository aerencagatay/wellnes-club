import { useTranslations } from 'next-intl'
import { getUpcomingCamps, getVenueForCamp } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { formatDateRange } from '@/lib/utils/dates'

/**
 * Hero'nun altında ince, yatay bir bilgi şeridi: tarih aralığı, konum, kontenjan,
 * süre — dikey ayırıcılarla ayrılmış dört madde, yanında büyük "Reserve your place"
 * CTA'sı (brief §4.2). Yaklaşan kamp yoksa (`getUpcomingCamps` boş döner) `null`
 * döner — üstte/altta sabit boşluklu ayrı `Section`ler olduğu için bu, sayfada
 * boşluk bırakmaz (bkz. task-5-report.md doğrulama bölümü).
 */
export function CampPanel({ locale, today }: { locale: AppLocale; today: string }) {
  const t = useTranslations('home.campPanel')
  const [camp] = getUpcomingCamps(today, 1)
  if (!camp) return null

  const venue = getVenueForCamp(camp)
  const days = camp.nights + 1

  return (
    <Section size="sm">
      <div className="flex flex-col gap-8 border-y border-sand py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:divide-x sm:divide-sand">
          <div className="font-heading text-xl text-text sm:pr-8">
            {formatDateRange(camp.startDate, camp.endDate, locale)}
          </div>
          <div className="text-sm text-muted sm:px-8">{venue.location[locale]}</div>
          <div className="text-sm text-muted sm:px-8">{t('guests', { count: camp.capacity })}</div>
          <div className="text-sm text-muted sm:pl-8">{t('duration', { days, nights: camp.nights })}</div>
        </div>
        <Button className="shrink-0" href={`/basvuru?kamp=${camp.slug}`} size="lg" variant="primary">
          {t('cta')}
        </Button>
      </div>
    </Section>
  )
}
