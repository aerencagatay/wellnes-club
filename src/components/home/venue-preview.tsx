import { useTranslations } from 'next-intl'
import { getVenueBySlug } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { GalleryStrip } from '@/components/ui/gallery-strip'
import { Section } from '@/components/ui/section'

const VENUE_SLUG = 'karadut-tas-otel'

// Oda tipi veya fiyat burada gösterilmez — yalnızca kısa açıklama ve öne
// çıkanlar listesi (bkz. src/content/venues.ts). Detaylar /mekan sayfasındadır.
export function VenuePreview({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.venue')
  const venue = getVenueBySlug(VENUE_SLUG)
  if (!venue) return null

  const images = venue.gallery.slice(0, 3).map((src) => ({ src, alt: venue.name }))

  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-section-title">{t('title')}</h2>
          <p className="type-lede mt-5">{venue.shortDescription[locale]}</p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-ink-3">
            {venue.highlights[locale].map((item) => (
              <li className="flex items-center gap-2" key={item}>
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-accent-deep" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/mekan">{t('cta')}</Button>
          </div>
        </div>
        <GalleryStrip images={images} />
      </div>
    </Section>
  )
}
