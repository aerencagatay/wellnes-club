import Image from 'next/image'
import type { Venue } from '@/content'

export function VenueGallery({ venue }: { venue: Venue }) {
  const [first, ...rest] = venue.gallery

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {first && (
        <div className="relative col-span-2 aspect-16/9 overflow-hidden rounded-md sm:aspect-2/1">
          <Image
            alt={venue.name}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            src={first}
          />
        </div>
      )}
      {rest.map((src) => (
        <div className="relative aspect-4/3 overflow-hidden rounded-md" key={src}>
          <Image
            alt={venue.name}
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
