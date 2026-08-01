import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function VenueLocation({ venue, locale }: { venue: Venue; locale: AppLocale }) {
  const t = useTranslations('venue')
  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>
        <p className="flex items-center gap-2 text-sm">
          <MapPin aria-hidden className="size-4 text-accent-deep" />
          {venue.location[locale]}
        </p>
        <h3 className="mt-3 font-heading text-2xl text-ink">{venue.name}</h3>
        <p className="type-lede mt-3">{venue.shortDescription[locale]}</p>
        <a
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep hover:underline"
          href={venue.websiteUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('officialSite')}
          <ExternalLink aria-hidden className="size-4" />
        </a>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <iframe
          allowFullScreen
          className="h-70 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={venue.mapEmbedUrl}
          title={t('mapTitle', { name: venue.name })}
        />
      </div>
    </div>
  )
}
