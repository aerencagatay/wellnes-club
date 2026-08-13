import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getUpcomingEvents } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { EventRow } from '@/components/events/event-row'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('kamplar.title'),
    description: t('kamplar.description'),
    alternates: buildAlternates(`/${locale}/kamplar`),
  }
}

/**
 * "Yaklaşan Etkinlikler" — tek, etkinlik odaklı bir liste.
 *
 * Eski kamp ızgarası, `CampFilters` ve "geçmiş kamplar" bölümü kaldırıldı:
 * elimizde şu an tek bir gerçek kamp var, üç eksenli bir filtre arayüzü
 * filtrelenecek içerikten daha ağırdı. `searchParams` de bu yüzden okunmuyor —
 * sayfa artık tamamen statik render edilebiliyor.
 *
 * `setRequestLocale` statik render için ZORUNLU: onsuz next-intl isteği
 * dinamik sayar ve sayfa her istekte yeniden render edilir.
 */
export default async function EventsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('events')

  // Bugünün tarihi seçiciye DIŞARIDAN veriliyor — `getUpcomingEvents` saat
  // okumaz, böylece test edilebilir kalır (bkz. content/index.ts).
  const today = new Date().toISOString().slice(0, 10)
  const events = getUpcomingEvents(today)

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section size="sm">
        {events.length === 0 ? (
          <p className="type-lede">{t('empty')}</p>
        ) : (
          // Satır aralığı bölüm dolgusuna yakın tutuluyor: her etkinlik kendi
          // "sayfası" gibi okunsun, ızgara hissi vermesin.
          <ul className="flex flex-col gap-24 lg:gap-36">
            {events.map((event, index) => (
              // Sayfanın h1'i PageHero'da; satır başlıkları bu yüzden h2.
              // İlk satırın görseli LCP adayı olduğu için `priority` alır.
              <EventRow event={event} index={index} key={event.id} locale={locale} priority={index === 0} />
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
