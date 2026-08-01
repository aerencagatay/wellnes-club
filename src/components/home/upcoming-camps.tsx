import { useTranslations } from 'next-intl'
import { getUpcomingCamps } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

export function UpcomingCamps({ locale, today }: { locale: AppLocale; today: string }) {
  const t = useTranslations('home.upcoming')
  const camps = getUpcomingCamps(today, 3)
  if (camps.length === 0) return null

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-section-title">{t('title')}</h2>
        </div>
        <Button href="/kamplar" variant="ghost">
          {t('viewAll')}
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {camps.map((camp) => (
          <CampCard camp={camp} key={camp.slug} locale={locale} />
        ))}
      </div>
    </Section>
  )
}
