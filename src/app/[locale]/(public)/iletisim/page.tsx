import { MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getVenueBySlug } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { ContactForm } from '@/components/contact-form'
import { PageHero } from '@/components/layout/page-hero'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { VenueLocation } from '@/components/venue/venue-location'
import { site } from '@/lib/config/site'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'
import { buildAlternates } from '@/lib/seo/metadata'

const VENUE_SLUG = 'karadut-tas-otel'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('iletisim.title'),
    description: t('iletisim.description'),
    alternates: buildAlternates(`/${locale}/iletisim`),
  }
}

export default async function ContactPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const venue = getVenueBySlug(VENUE_SLUG)
  if (!venue) notFound()

  const t = await getTranslations('contact')
  const tCommon = await getTranslations('common')
  const whatsappUrl = buildWhatsAppUrl(t('whatsappMessage'))

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow>{t('detailsTitle')}</Eyebrow>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-ink-3">
              <li>
                <a className="transition-colors hover:text-ink" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink" href={site.phoneHref}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-ink"
                  href={site.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t('instagramLabel')}
                </a>
              </li>
              {whatsappUrl && (
                <li>
                  <a
                    className="flex items-center gap-2 transition-colors hover:text-ink"
                    href={whatsappUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden className="size-4 text-accent-deep" />
                    {tCommon('whatsapp')}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <Eyebrow>{t('form.title')}</Eyebrow>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <Section background="cream-2">
        <Eyebrow>{t('venueTitle')}</Eyebrow>
        <div className="mt-6">
          {/* Eyebrow bir başlık değildir; bu bileşen sayfanın h1'inden (PageHero) sonra
              ara bir h2 olmadan geliyor — h3 verirsek başlık seviyesi h1 → h3 atlar.
              onTintedBackground: bu Section cream-2 zemininde (bkz. VenueLocation'daki
              kontrast notu). */}
          <VenueLocation headingLevel="h2" locale={locale} onTintedBackground venue={venue} />
        </div>
      </Section>
    </>
  )
}
