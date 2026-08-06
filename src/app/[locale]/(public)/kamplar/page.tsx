import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { getPastCamps, getUpcomingCamps, type Level, type Program } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { CampFilters } from '@/components/camps/camp-filters'
import { PageHero } from '@/components/layout/page-hero'
import { RevealGroup } from '@/components/motion/reveal'
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
          <RevealGroup className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((camp) => (
              // Bu grid, sayfanın h1'inden (PageHero) sonra ara bir h2 bölüm başlığı
              // olmadan geliyor — h3 verirsek başlık seviyesi h1 → h3 atlar.
              <CampCard camp={camp} headingLevel="h2" key={camp.slug} locale={locale} />
            ))}
          </RevealGroup>
        )}
      </Section>

      {past.length > 0 && (
        <Section background="surface">
          <h2 className="type-title">{t('pastTitle')}</h2>
          {/* `opacity-65` KULLANILMIYOR: opaklık, kartın içindeki TÜM metni de zeminle
              birlikte soldurur — metin ve zemin aynı arka plana doğru harmanlandığı için
              aralarındaki kontrast oranı da çöker (Lighthouse'ta gerçek, ölçülebilir bir
              WCAG AA ihlali olarak yakalandı: ör. #9c9b9a/#f7f3ef ~2.51:1). Bölümün kendi
              başlığı ("Geçmiş kamplar") ve cream-2 zemini bu kartları "geçmiş" olarak
              ayırt etmek için zaten yeterli; kontrastı bozmadan bunu yapıyor. */}
          <RevealGroup className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {past.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  )
}
