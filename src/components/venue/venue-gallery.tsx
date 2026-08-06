'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { VenueLightbox } from './venue-lightbox'

/**
 * `images`/`name` çağıran taraftan ayrı verilir (yalnızca `venue: Venue` almaz): /mekan
 * sayfası `PageHero`'da zaten `venue.gallery[0]`'ı gösteriyor (bkz. mekan/page.tsx), bu
 * yüzden burada tam `venue.gallery`'yi almak aynı görseli hem hero'da hem galerinin ilk
 * karesinde — ikisi de `priority` ile — tekrar ederdi. Çağıran taraf hangi alt kümeyi
 * göstereceğine karar verir (bkz. mekan/page.tsx → `venue.gallery.slice(1)`).
 *
 * Her kare, aynı `images` dizisi üzerinde tam ekran bir `VenueLightbox` açan bir
 * düğmedir — odak tuzağı ve kaydırma kilidi için bkz. venue-lightbox.tsx.
 */
export function VenueGallery({ images, name }: { images: string[]; name: string }) {
  const t = useTranslations('venue')
  const total = images.length
  const [first, ...rest] = images
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const lightboxImages = images.map((src, index) => ({
    src,
    alt: t('galleryImageAlt', { name, index: index + 1, total }),
  }))

  function openAt(index: number, trigger: HTMLElement) {
    triggerRef.current = trigger
    setOpenIndex(index)
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {first && (
        <button
          className="relative col-span-2 aspect-16/9 overflow-hidden sm:aspect-2/1"
          data-testid="venue-gallery-thumb-0"
          onClick={(event) => openAt(0, event.currentTarget)}
          type="button"
        >
          <Image
            alt={t('galleryImageAlt', { name, index: 1, total })}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            src={first}
          />
        </button>
      )}
      {rest.map((src, index) => (
        <button
          // Mozaik: her üçüncü kare (dizinin 3'e göre modu — hero'dan sonraki
          // ilk kare) iki sütuna yayılır, geri kalanı kare kalır. Bu, tekdüze
          // bir ızgara yerine hafif asimetrik bir editorial doku üretir.
          className={`relative overflow-hidden ${index % 3 === 0 ? 'col-span-2 aspect-2/1 sm:col-span-1 sm:aspect-4/3' : 'aspect-4/3'}`}
          data-testid={`venue-gallery-thumb-${index + 1}`}
          key={src}
          onClick={(event) => openAt(index + 1, event.currentTarget)}
          type="button"
        >
          <Image
            alt={t('galleryImageAlt', { name, index: index + 2, total })}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 33vw"
            src={src}
          />
        </button>
      ))}

      <VenueLightbox
        ariaLabel={t('lightboxLabel', { name })}
        closeLabel={t('lightboxClose')}
        counterLabel={(current, count) => t('lightboxCounter', { current, total: count })}
        images={lightboxImages}
        index={openIndex}
        nextLabel={t('lightboxNext')}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
        prevLabel={t('lightboxPrev')}
        triggerRef={triggerRef}
      />
    </div>
  )
}
