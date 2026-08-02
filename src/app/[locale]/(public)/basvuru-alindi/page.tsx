import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

// Bu sayfaya yalnızca başarılı bir gönderimin ardından ulaşılır ve içeriği tekildir
// (referans numarası) — arama sonuçlarında görünmesinin hiçbir değeri yoktur.
export const metadata = {
  robots: { index: false },
}

export default async function InquiryReceivedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { ref } = await searchParams
  const t = await getTranslations('inquiryReceived')

  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="type-section-title">{t('title')}</h1>
        <p className="type-lede mt-5">{t('lede')}</p>
        {ref && (
          <p className="mt-8 inline-block rounded-sm bg-cream-2 px-6 py-4 text-sm">
            {t('reference')} <strong className="font-mono tracking-wider text-ink">{ref}</strong>
          </p>
        )}
        <div className="mt-10 flex justify-center gap-4">
          <Button href="/kamplar" variant="ghost">
            {t('otherCamps')}
          </Button>
        </div>
      </div>
    </Section>
  )
}
