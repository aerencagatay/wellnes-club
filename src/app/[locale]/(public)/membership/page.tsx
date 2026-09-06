import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { HandArrow, OliveBranch, Squiggle } from '@/components/art/marks'
import { PageHero } from '@/components/layout/page-hero'
import { MembershipForm } from '@/components/membership/membership-form'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

/** Üyeliğin bugün ne SUNDUĞU değil, ne OLACAĞI — üçü de henüz aktif değil. */
const PROMISE_ITEMS = ['1', '2', '3'] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('membership.title'),
    description: t('membership.description'),
    alternates: buildAlternates(`/${locale}/membership`),
  }
}

/**
 * MEMBERSHIP — BAŞVURU SAYFASI.
 *
 * KAPSAM (kullanıcı kararı, 2026-09-05): üyelik programı rafa kaldırıldı.
 * Sayfa navigasyonda görünür ve gerçek bir başvuru formu taşır, ama üyeliğin
 * KENDİSİ kurulmaz. Burada BİLİNÇLİ OLARAK OLMAYANLAR:
 *
 *   ödeme · üyelik kademeleri · kimlik doğrulama · üye paneli · hesap oluşturma
 *   · abonelik mantığı · onay iş akışı · avantaj yönetimi · form arka ucu
 *
 * Sayfanın en önemli metni `notOpenNote`: ziyaretçiye üyeliğin henüz açık
 * OLMADIĞINI ve bıraktığı başvurunun bir ön-ilgi listesi olduğunu söyler. Bu
 * satır kaldırılmamalıdır — onsuz sayfa, var olmayan bir üyeliğe kayıt
 * alıyormuş gibi okunur.
 */
export default async function MembershipPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('membership')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      {/* "Üyelik henüz açık değil" uyarısı — sayfanın ilk okunan bloğu olmalı,
          forma inmeden önce. Sarı highlighter zemini + kalın hairline: sistemin
          "bunu oku" işareti (bkz. globals.css). */}
      <Section background="background" size="sm">
        <div className="flex max-w-3xl items-start gap-4 border-2 border-text bg-yellow p-6 md:p-8">
          <HandArrow aria-hidden className="mt-1 hidden h-8 w-12 shrink-0 -rotate-12 text-text sm:block" />
          <p className="text-base leading-relaxed font-medium text-text">{t('notOpenNote')}</p>
        </div>
      </Section>

      <Section background="forest" size="sm">
        <OliveBranch className="pointer-events-none absolute -right-8 -top-8 hidden h-64 w-40 text-background/20 lg:block" />
        <h2 className="type-title max-w-2xl text-balance">{t('promiseTitle')}</h2>
        <Squiggle className="ink-sun mt-4 h-3 w-24" />
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {PROMISE_ITEMS.map((item) => (
            <li className="border-t border-background/40 pt-5" key={item}>
              <h3 className="font-heading text-xl font-bold text-background">{t(`promise${item}Title`)}</h3>
              <p className="type-lede mt-3 text-sm">{t(`promise${item}Body`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section background="background" className="grain">
        <div className="mx-auto max-w-3xl">
          <h2 className="type-title text-balance">{t('formTitle')}</h2>
          <p className="type-lede mt-4">{t('formLede')}</p>
          <div className="mt-10">
            <MembershipForm />
          </div>
        </div>
      </Section>
    </>
  )
}
