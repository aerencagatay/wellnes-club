import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { getPastCamps, getUpcomingCamps, type Level, type Program } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { CampFilters } from '@/components/camps/camp-filters'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { filterCamps } from '@/lib/utils/camp-status'

const PROGRAMS = new Set<string>(['yoga', 'pilates', 'yoga-pilates'])
const LEVELS = new Set<string>(['baslangic', 'tum-seviyeler', 'ileri'])

export default async function CampsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ program?: string; level?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const query = await searchParams
  const t = await getTranslations('camps')
  const today = new Date().toISOString().slice(0, 10)

  // Bilinmeyen sorgu değerleri sessizce "hepsi" olarak ele alınır.
  const program = query.program && PROGRAMS.has(query.program) ? (query.program as Program) : 'all'
  const level = query.level && LEVELS.has(query.level) ? (query.level as Level) : 'all'

  const upcoming = filterCamps(getUpcomingCamps(today), { program, level })
  const past = getPastCamps(today)

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section size="sm">
        <Suspense fallback={null}>
          <CampFilters />
        </Suspense>

        {upcoming.length === 0 ? (
          <p className="type-lede mt-12">{t('empty')}</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section background="cream-2">
          <h2 className="type-section-title">{t('pastTitle')}</h2>
          <div className="mt-10 grid gap-6 opacity-65 md:grid-cols-2 lg:grid-cols-3">
            {past.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
