import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getUpcomingCamps } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { InquiryForm } from '@/components/inquiry/inquiry-form'
import { PageHero } from '@/components/layout/page-hero'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { site } from '@/lib/config/site'

export default async function InquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ kamp?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { kamp } = await searchParams

  const t = await getTranslations('inquiryPage')
  const tForm = await getTranslations('form')
  const today = new Date().toISOString().slice(0, 10)
  const camps = getUpcomingCamps(today)

  // ?kamp= bilinmeyen/uydurma bir slug taşıyorsa sessizce ilk yaklaşan kampa düşülür —
  // InquiryForm içindeki istemci tarafı ön-seçim mantığıyla (useSearchParams okuyan aynı
  // kural) aynı davranış; böylece sağdaki özet kartı formun varsayılan seçimiyle her
  // zaman eşleşir.
  const selectedCamp = camps.find((camp) => camp.slug === kamp) ?? camps[0]

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section>
        {camps.length === 0 || !selectedCamp ? (
          <div className="max-w-xl">
            <p className="type-lede">{tForm('noCamps')}</p>
            <a
              className="mt-4 inline-block font-semibold text-accent-deep hover:underline"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-16">
            <Suspense fallback={null}>
              <InquiryForm camps={camps} locale={locale} />
            </Suspense>

            <aside className="mt-16 flex flex-col gap-8 lg:mt-0">
              <div>
                <Eyebrow>{t('summaryTitle')}</Eyebrow>
                <div className="mt-4">
                  <CampCard camp={selectedCamp} locale={locale} />
                </div>
              </div>
              <div className="rounded-md bg-cream-2 p-6">
                <h2 className="font-heading text-lg text-ink">{t('whyTitle')}</h2>
                <p className="mt-2 text-sm text-body">{t('whyBody')}</p>
              </div>
            </aside>
          </div>
        )}
      </Section>
    </>
  )
}
