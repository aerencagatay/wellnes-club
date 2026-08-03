import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getUpcomingCamps, getVenueBySlug } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { VenueGallery } from '@/components/venue/venue-gallery'
import { VenueHighlights } from '@/components/venue/venue-highlights'
import { VenueLocation } from '@/components/venue/venue-location'
import { PRIMARY_VENUE_SLUG } from '@/lib/config/site'
import { buildAlternates } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('mekan.title'),
    description: t('mekan.description'),
    alternates: buildAlternates(`/${locale}/mekan`),
  }
}

// Bu sayfa bilinçli olarak kısa tutulur: oda tipi, oda fiyatı ve müsaitlik
// burada YER ALMAZ. Otelin kendi sitesi bu bilgileri zaten yönetiyor; burada
// tekrarlamak iki yerde aynı veriyi güncel tutmak anlamına gelir. Konaklama
// merakı VenueLocation içindeki dış bağlantıya ve accommodationNote mesajına
// yönlendirilir.
export default async function VenuePage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const venue = getVenueBySlug(PRIMARY_VENUE_SLUG)
  if (!venue) notFound()

  const t = await getTranslations('venue')
  const today = new Date().toISOString().slice(0, 10)
  const camps = getUpcomingCamps(today).filter((camp) => camp.venueSlug === venue.slug)

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        image={{ src: venue.gallery[0], alt: venue.name }}
        lede={t('lede')}
        title={t('title')}
      />

      <Section>
        {/* PageHero yukarıda zaten `venue.gallery[0]`'ı gösteriyor; galeriyi bir kaydırarak
            aynı görselin ikinci kez (ve ikisi de `priority` ile) gösterilmesini önlüyoruz. */}
        <VenueGallery images={venue.gallery.slice(1)} name={venue.name} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <p>{t('body1')}</p>
          <p>{t('body2')}</p>
        </div>
      </Section>

      <Section background="cream-2">
        <VenueHighlights locale={locale} venue={venue} />
      </Section>

      <Section>
        <VenueLocation locale={locale} venue={venue} />
        <p className="mt-6 text-sm text-body">{t('accommodationNote')}</p>
      </Section>

      <Section background="cream-2">
        <h2 className="type-section-title">{t('campsHere')}</h2>
        {camps.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {camps.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Button href="/kamplar">{t('cta')}</Button>
        </div>
      </Section>
    </>
  )
}
