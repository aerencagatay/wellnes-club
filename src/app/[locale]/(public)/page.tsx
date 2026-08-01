import { setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { HeroHome } from '@/components/home/hero-home'
import { TrustStrip } from '@/components/home/trust-strip'
import { Manifesto } from '@/components/home/manifesto'
import { UpcomingCamps } from '@/components/home/upcoming-camps'
import { IncludesList } from '@/components/home/includes-list'
import { BenefitsSection } from '@/components/home/benefits-section'
import { TeachersPreview } from '@/components/home/teachers-preview'
import { VenuePreview } from '@/components/home/venue-preview'
import { Testimonials } from '@/components/home/testimonials'
import { NewsletterCta } from '@/components/home/newsletter-cta'

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  // Sunucuda render anında hesaplanır ve seçicilere parametre olarak geçer.
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <HeroHome />
      <TrustStrip />
      <Manifesto />
      <UpcomingCamps locale={locale} today={today} />
      <IncludesList />
      <BenefitsSection />
      <TeachersPreview locale={locale} />
      <VenuePreview locale={locale} />
      <Testimonials locale={locale} />
      <NewsletterCta />
    </>
  )
}
