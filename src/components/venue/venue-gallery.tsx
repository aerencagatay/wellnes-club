import Image from 'next/image'
import { useTranslations } from 'next-intl'

/**
 * `images`/`name` çağıran taraftan ayrı verilir (yalnızca `venue: Venue` almaz): /mekan
 * sayfası `PageHero`'da zaten `venue.gallery[0]`'ı gösteriyor (bkz. mekan/page.tsx), bu
 * yüzden burada tam `venue.gallery`'yi almak aynı görseli hem hero'da hem galerinin ilk
 * karesinde — ikisi de `priority` ile — tekrar ederdi. Çağıran taraf hangi alt kümeyi
 * göstereceğine karar verir (bkz. mekan/page.tsx → `venue.gallery.slice(1)`).
 */
export function VenueGallery({ images, name }: { images: string[]; name: string }) {
  const t = useTranslations('venue')
  const total = images.length
  const [first, ...rest] = images

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {first && (
        <div className="relative col-span-2 aspect-16/9 overflow-hidden rounded-md sm:aspect-2/1">
          <Image
            alt={t('galleryImageAlt', { name, index: 1, total })}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            src={first}
          />
        </div>
      )}
      {rest.map((src, index) => (
        <div className="relative aspect-4/3 overflow-hidden rounded-md" key={src}>
          <Image
            alt={t('galleryImageAlt', { name, index: index + 2, total })}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 33vw"
            src={src}
          />
        </div>
      ))}
    </div>
  )
}
