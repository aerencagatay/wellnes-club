import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function VenueLocation({
  venue,
  locale,
  headingLevel = 'h3',
  onTintedBackground = false,
}: {
  venue: Venue
  locale: AppLocale
  /** `/iletisim` bu bileşeni bir `h2` bölüm başlığı olmadan (yalnızca bir `Eyebrow`
   *  ile) yerleştirir — orada `h2` verilmelidir, aksi halde `h1 → h3` atlar. Kamp
   *  detay sayfası kendi `h2`'sinin ("Kalacağınız Yer") altına yerleştirdiği için
   *  varsayılan `h3` orada doğru iç içe geçmeyi korur. */
  headingLevel?: 'h2' | 'h3'
  /** `/iletisim` bu bileşeni bir `Section background="surface"` içine yerleştirir;
   *  orada düz gövde metni (ve `.type-lede`'in varsayılan rengi) WCAG AA eşiğinin
   *  altına düşer (bkz. globals.css'teki --color-muted token yorumu). Kamp detay ve `/mekan`
   *  sayfaları bu bileşeni düz krem zeminde kullandığı için varsayılan `false` kalır. */
  onTintedBackground?: boolean
}) {
  const t = useTranslations('venue')
  const Heading = headingLevel
  const mutedClass = onTintedBackground ? 'text-muted' : ''
  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>
        <p className={`flex items-center gap-2 text-sm ${mutedClass}`.trim()}>
          <MapPin aria-hidden className="size-4 text-olive" />
          {venue.location[locale]}
        </p>
        <Heading className="mt-3 font-heading text-2xl text-text">{venue.name}</Heading>
        <p className={`type-lede mt-3 ${mutedClass}`.trim()}>{venue.shortDescription[locale]}</p>
        <a
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-olive hover:underline"
          href={venue.websiteUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('officialSite')}
          <ExternalLink aria-hidden className="size-4" />
        </a>
      </div>
      <div className="overflow-hidden border border-sand">
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
