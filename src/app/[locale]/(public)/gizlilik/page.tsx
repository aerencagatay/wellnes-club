import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('gizlilik.title'),
    description: t('gizlilik.description'),
    alternates: buildAlternates(`/${locale}/gizlilik`),
  }
}

export default async function PrivacyPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('privacy.title')} />
      <Section size="sm">
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="rounded-sm border border-amber bg-amber/12 p-4 text-sm text-ink">
            {t('placeholderWarning')}
          </p>
          <p>{t('privacy.body1')}</p>
          <p>{t('privacy.body2')}</p>
        </div>
      </Section>
    </>
  )
}
