import Image from 'next/image'

export function GalleryStrip({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image, index) => (
        <li className="relative aspect-4/3 overflow-hidden rounded-none" key={image.src}>
          <Image
            alt={image.alt}
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            fill
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 50vw, 33vw"
            src={image.src}
          />
        </li>
      ))}
    </ul>
  )
}
