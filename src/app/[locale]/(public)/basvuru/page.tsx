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
import { buildAlternates } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('basvuru.title'),
    description: t('basvuru.description'),
    alternates: buildAlternates(`/${locale}/basvuru`),
  }
}

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
              className="mt-4 inline-block font-semibold text-olive hover:underline"
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
                  {/* Bu kart sayfanın h1'inden (PageHero) sonra ara bir h2 olmadan
                      geliyor — h3 verirsek başlık seviyesi h1 → h3 atlar. */}
                  <CampCard camp={selectedCamp} headingLevel="h2" locale={locale} media="poster" />
                </div>
              </div>
              <div className="rounded-[var(--radius-card)] border border-text/10 bg-surface p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-heading text-lg text-text">{t('whyTitle')}</h2>
                {/* text-muted: bu kutu bg-surface zemininde, düz text-muted orada
                    WCAG AA eşiğinin altında kalır (bkz. globals.css'teki -deep token
                    yorumu). */}
                <p className="mt-2 text-sm text-muted">{t('whyBody')}</p>
              </div>
            </aside>
          </div>
        )}
      </Section>
    </>
  )
}
