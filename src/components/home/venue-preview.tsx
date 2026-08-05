'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { getVenueBySlug } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { Parallax } from '@/components/motion/parallax'
import { Reveal } from '@/components/motion/reveal'
import { VenueLightbox } from '@/components/venue/venue-lightbox'
import { PRIMARY_VENUE_SLUG } from '@/lib/config/site'

// Oda tipi veya fiyat burada gösterilmez — yalnızca kısa açıklama ve öne
// çıkanlar listesi (bkz. src/content/venues.ts). Detaylar /mekan sayfasındadır.
// Editorial kompozisyon: solda büyük ana fotoğraf (hafif parallax), sağda iki
// küçük detay fotoğrafı — carousel değil (bkz. brief §4.4). Tıklayınca tam
// galeri (`venue.gallery`'nin tamamı) fullscreen lightbox'ta açılır.
export function VenuePreview({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.venue')
  const tVenue = useTranslations('venue')
  const venue = getVenueBySlug(PRIMARY_VENUE_SLUG)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  if (!venue) return null

  const [main, detail1, detail2] = venue.gallery
  const lightboxImages = venue.gallery.map((src, index) => ({
    src,
    alt: tVenue('galleryImageAlt', { name: venue.name, index: index + 1, total: venue.gallery.length }),
  }))

  function openAt(index: number, trigger: HTMLElement) {
    triggerRef.current = trigger
    setOpenIndex(index)
  }

  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-title">{t('title')}</h2>
          <p className="type-lede mt-5">{venue.shortDescription[locale]}</p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
            {venue.highlights[locale].map((item) => (
              <li className="flex items-center gap-2" key={item}>
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-olive" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/mekan">{t('cta')}</Button>
            <Button
              data-testid="venue-preview-open-gallery"
              onClick={(event) => openAt(0, event.currentTarget)}
              variant="ghost"
            >
              {t('viewGallery')}
            </Button>
          </div>
        </div>

        <Reveal>
          <div className="grid grid-cols-2 gap-3">
            {main && (
              <button
                className="relative col-span-2 aspect-16/10 overflow-hidden"
                data-testid="venue-preview-thumb-main"
                onClick={(event) => openAt(0, event.currentTarget)}
                type="button"
              >
                <Parallax amount={24} className="absolute inset-0">
                  <Image
                    alt={lightboxImages[0]?.alt ?? venue.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={main}
                  />
                </Parallax>
              </button>
            )}
            {[detail1, detail2].map((src, index) =>
              src ? (
                <button
                  className="relative aspect-square overflow-hidden"
                  data-testid={`venue-preview-thumb-detail-${index + 1}`}
                  key={src}
                  onClick={(event) => openAt(index + 1, event.currentTarget)}
                  type="button"
                >
                  <Image
                    alt={lightboxImages[index + 1]?.alt ?? venue.name}
                    className="object-cover"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src={src}
                  />
                </button>
              ) : null,
            )}
          </div>
        </Reveal>
      </div>

      <VenueLightbox
        ariaLabel={tVenue('lightboxLabel', { name: venue.name })}
        closeLabel={tVenue('lightboxClose')}
        counterLabel={(current, count) => tVenue('lightboxCounter', { current, total: count })}
        images={lightboxImages}
        index={openIndex}
        nextLabel={tVenue('lightboxNext')}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
        prevLabel={tVenue('lightboxPrev')}
        triggerRef={triggerRef}
      />
    </Section>
  )
}
