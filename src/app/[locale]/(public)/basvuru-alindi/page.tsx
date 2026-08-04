import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

// Bu sayfaya yalnızca başarılı bir gönderimin ardından ulaşılır ve içeriği tekildir
// (referans numarası) — arama sonuçlarında görünmesinin hiçbir değeri yoktur.
// `alternates` yine de kendi yoluna göre kurulur: yoksa Next, layout'un `/${locale}`
// için ürettiği alternates'e düşer ve bu sayfa ana sayfanın canonical/hreflang'ını
// taşımış olurdu — noindex olsa bile yanlıştır.
export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  return {
    robots: { index: false, follow: false },
    alternates: buildAlternates(`/${locale}/basvuru-alindi`),
  }
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
        <h1 className="type-title">{t('title')}</h1>
        <p className="type-lede mt-5">{t('lede')}</p>
        {ref && (
          // text-muted: bu kutu bg-surface zemininde, düz gövde metni orada WCAG AA
          // eşiğinin altında kalır (bkz. globals.css'teki --color-muted token yorumu).
          <p className="mt-8 inline-block rounded-sm bg-surface px-6 py-4 text-sm text-muted">
            {t('reference')} <strong className="font-mono tracking-wider text-text">{ref}</strong>
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
