import type { CampSession, CampStatus, FaqItem, Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { site } from '@/lib/config/site'
import { trimSlash } from '@/lib/utils/locale'

// `trimSlash` burada yeniden dışa aktarılır: bu dosyanın çağıranları (ör.
// `kamplar/[slug]/page.tsx`) onu `@/lib/seo/jsonld`'den içe aktarıyordu; tek kaynak artık
// `@/lib/utils/locale`, ama mevcut import yolunu kırmamak için burada re-export ediyoruz.
export { trimSlash }

const EVENT_STATUS: Record<CampStatus, string> = {
  open: 'https://schema.org/EventScheduled',
  waitlist: 'https://schema.org/EventScheduled',
  closed: 'https://schema.org/EventCancelled',
}

export function buildCampEventJsonLd({
  camp, venue, locale, siteUrl,
}: {
  camp: CampSession; venue: Venue; locale: AppLocale; siteUrl: string
}): Record<string, unknown> {
  const url = `${trimSlash(siteUrl)}/${locale}/kamplar/${camp.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: camp.title[locale],
    description: camp.summary[locale],
    startDate: camp.startDate,
    endDate: camp.endDate,
    eventStatus: EVENT_STATUS[camp.status],
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    image: `${trimSlash(siteUrl)}${camp.heroImage}`,
    maximumAttendeeCapacity: camp.capacity,
    organizer: { '@type': 'Organization', name: site.name, url: trimSlash(siteUrl) },
    location: {
      '@type': 'Place',
      name: venue.name,
      address: { '@type': 'PostalAddress', addressLocality: venue.location[locale], addressCountry: 'TR' },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.coordinates.lat,
        longitude: venue.coordinates.lng,
      },
    },
    offers: {
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: camp.currency,
      availability:
        camp.status === 'open' && camp.spotsLeft > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url,
    },
  }
}

/** Yol içermeyen bir profil URL'si (ör. "https://instagram.com/") gerçek bir hesaba işaret etmez — yer tutucudur. */
export function isRealProfileUrl(url: string): boolean {
  try {
    return new URL(url).pathname.replace(/^\/+/, '') !== ''
  } catch {
    return false
  }
}

export function buildOrganizationJsonLd({
  siteUrl, locale,
}: { siteUrl: string; locale: AppLocale }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${trimSlash(siteUrl)}/${locale}`,
    email: site.email,
    // Yer tutucu bir profile "sameAs" ile işaret etmek yanlış bir iddia üretir (ör.
    // Instagram'ın kendi ana sayfası hesabımızmış gibi görünür) — eksik alan dürüst,
    // yanlış alan değildir. Gerçek bir profil bağlanana kadar alan tamamen atlanır.
    ...(isRealProfileUrl(site.instagram) ? { sameAs: [site.instagram] } : {}),
  }
}

export function buildFaqJsonLd({
  items, locale,
}: { items: FaqItem[]; locale: AppLocale }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.answer[locale] },
    })),
  }
}
