import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('kvkk.title'),
    description: t('kvkk.description'),
    alternates: buildAlternates(`/${locale}/kvkk`),
  }
}

export default async function KvkkPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('kvkk.title')} />
      <Section size="sm">
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="rounded-sm rounded-sm bg-sand/40 p-4 text-sm font-medium text-text">
            {t('placeholderWarning')}
          </p>
          <p>{t('kvkk.body1')}</p>
          <p>{t('kvkk.body2')}</p>
        </div>
      </Section>
    </>
  )
}
