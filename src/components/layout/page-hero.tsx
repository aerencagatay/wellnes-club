import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}) {
  return (
    <section className="relative">
      {image && (
        <div className="relative h-[42vh] min-h-70 w-full">
          <Image alt={image.alt} className="object-cover" fill priority sizes="100vw" src={image.src} />
          <div aria-hidden className="absolute inset-0 bg-ink/35" />
        </div>
      )}
      <div className={`container-page ${image ? 'relative -mt-24 pb-12' : 'section-sm'}`}>
        <div className={image ? 'max-w-3xl rounded-lg bg-cream p-8 md:p-12' : 'max-w-3xl'}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="type-section-title">{title}</h1>
          {lede && <p className="type-lede mt-5">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
