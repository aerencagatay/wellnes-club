import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFaq } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Accordion } from '@/components/ui/accordion'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildFaqJsonLd } from '@/lib/seo/jsonld'

export default async function FaqPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('faq')
  const items = getFaq()

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd({ items, locale })) }}
        type="application/ld+json"
      />
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />
      <Section size="sm">
        <div className="max-w-3xl">
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              question: item.question[locale],
              answer: item.answer[locale],
            }))}
          />
        </div>
      </Section>
    </>
  )
}
