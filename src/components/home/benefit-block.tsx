import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'

export function BenefitBlock({
  eyebrow,
  title,
  body,
  image,
  reversed = false,
}: {
  eyebrow: string
  title: string
  body: ReactNode
  image: { src: string; alt: string }
  reversed?: boolean
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={`relative aspect-4/3 overflow-hidden rounded-lg ${reversed ? 'md:order-2' : ''}`}>
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          src={image.src}
        />
      </div>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="type-title">{title}</h3>
        <div className="type-lede mt-5">{body}</div>
      </div>
    </div>
  )
}
