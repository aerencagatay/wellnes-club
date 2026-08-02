import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { getPastCamps, getUpcomingCamps, type Level, type Program } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { CampFilters } from '@/components/camps/camp-filters'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'
import { filterCamps, LEVELS, PROGRAMS } from '@/lib/utils/camp-status'

function isProgram(value: string): value is Program {
  return (PROGRAMS as readonly string[]).includes(value)
}

function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value)
}

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('kamplar.title'),
    description: t('kamplar.description'),
    alternates: buildAlternates(`/${locale}/kamplar`),
  }
}

/** `?program=a&program=b` gibi tekrarlanan anahtarlarda Next `string[]` verir; bunu kasıtlı olarak geçersiz sayarız. */
function asSingleValue(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export default async function CampsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ program?: string | string[]; level?: string | string[] }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const query = await searchParams
  const t = await getTranslations('camps')
  const today = new Date().toISOString().slice(0, 10)

  // Bilinmeyen veya tekrarlanan sorgu değerleri sessizce "hepsi" olarak ele alınır.
  const rawProgram = asSingleValue(query.program)
  const rawLevel = asSingleValue(query.level)
  const program = rawProgram && isProgram(rawProgram) ? rawProgram : 'all'
  const level = rawLevel && isLevel(rawLevel) ? rawLevel : 'all'

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
