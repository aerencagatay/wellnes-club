import { Check } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { BenefitBlock } from '@/components/home/benefit-block'
import { TeachersPreview } from '@/components/home/teachers-preview'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

const APPROACH_ITEMS = ['1', '2', '3'] as const

export default async function AboutPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <p className="type-lede">{t('storyBody1')}</p>
          <p className="type-lede">{t('storyBody2')}</p>
        </div>
      </Section>

      <Section background="cream-2">
        <div className="max-w-xl">
          <Eyebrow>{t('approachEyebrow')}</Eyebrow>
          <h2 className="type-section-title">{t('approachTitle')}</h2>
        </div>
        <ul className="mt-10 flex flex-col gap-6">
          {APPROACH_ITEMS.map((item) => (
            <li className="flex items-start gap-4" key={item}>
              <Check aria-hidden className="mt-1 size-5 shrink-0 text-accent-deep" />
              <p className="text-base">{t(`approachItems.${item}`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <BenefitBlock
          body={t('whyAssosBody')}
          eyebrow={t('whyAssosEyebrow')}
          image={{ src: '/img/venue/kusbakisi.webp', alt: t('whyAssosImageAlt') }}
          title={t('whyAssosTitle')}
        />
      </Section>

      <TeachersPreview locale={locale} />

      <Section>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="type-section-title">{t('ctaTitle')}</h2>
          <p className="type-lede mt-4">{t('ctaBody')}</p>
          <div className="mt-8">
            <Button href="/iletisim">{t('ctaButton')}</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
