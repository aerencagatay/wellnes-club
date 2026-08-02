import { Check } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFeaturedCamps } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { DailyFlow } from '@/components/camps/daily-flow'
import { PageHero } from '@/components/layout/page-hero'
import { Badge } from '@/components/ui/badge'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'
import { LEVELS } from '@/lib/utils/camp-status'

const BRING_ITEMS = ['1', '2', '3', '4', '5', '6'] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('deneyim.title'),
    description: t('deneyim.description'),
    alternates: buildAlternates(`/${locale}/deneyim`),
  }
}

export default async function ExperiencePage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('experience')
  const tCamp = await getTranslations('camp')

  // "Bir gün nasıl geçer" bölümü tek bir örnek üzerinden anlatılır: öne çıkan
  // kampların ilki. Her kampın kendi akışı zaten kamp detay sayfasında yer alıyor —
  // burası yalnızca genel bir fikir vermek için.
  const sampleCamp = getFeaturedCamps()[0]

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      {sampleCamp && (
        <Section>
          <DailyFlow items={sampleCamp.dailyFlow} locale={locale} note={t('dailyFlowNote')} />
        </Section>
      )}

      <Section background="cream-2">
        <div className="max-w-2xl">
          <h2 className="type-section-title">{t('nutritionTitle')}</h2>
          {/* text-body-deep: bu bölüm cream-2 zemininde, düz gövde metni orada WCAG AA
              eşiğinin altında kalır (bkz. globals.css'teki -deep token yorumu). */}
          <p className="mt-5 text-body-deep">{t('nutritionBody1')}</p>
          <p className="mt-4 text-body-deep">{t('nutritionBody2')}</p>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>{t('bringEyebrow')}</Eyebrow>
          <h2 className="type-section-title">{t('bringTitle')}</h2>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {BRING_ITEMS.map((item) => (
            <li className="flex items-start gap-3 text-sm" key={item}>
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-deep" />
              {t(`bringItems.${item}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section background="cream-2">
        <div className="max-w-2xl">
          <h2 className="type-section-title">{t('levelsTitle')}</h2>
          {/* text-body-deep: bu bölüm cream-2 zemininde, düz gövde metni orada WCAG AA
              eşiğinin altında kalır (bkz. globals.css'teki -deep token yorumu). */}
          <p className="mt-5 text-body-deep">{t('levelsBody')}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {LEVELS.map((level) => (
              <Badge key={level} tone="neutral">
                {tCamp(`level.${level}`)}
              </Badge>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
