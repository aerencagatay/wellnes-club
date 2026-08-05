import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { MaskedLines } from '@/components/motion/masked-lines'
import { Parallax } from '@/components/motion/parallax'

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
    // `bg-dark`: yalnızca görsel varyantı için — `Navbar` bunu, sayfanın en üstünde
    // gerçek bir koyu hero olup olmadığını (dolayısıyla şeffaf/açık metin
    // tedavisinin güvenli olup olmadığını) anlamak için `main`'in ilk çocuğunda
    // arar (bkz. navbar.tsx). Görsel yoksa arka plan zaten krem `background`dir,
    // bu sınıf eklenmez.
    <section className={`relative ${image ? 'bg-dark' : 'pt-18'}`}>
      {image && (
        <div className="relative h-[42vh] min-h-70 w-full overflow-hidden">
          {/* Kırpma sınırından taşan iç kapsayıcı: `Parallax`'ın ±40px'lik
              dikey kayması burada boşluk açmadan tam sığar (-top/-bottom 40px
              = amount). */}
          <Parallax amount={40} className="absolute -top-10 -bottom-10 inset-x-0">
            <Image alt={image.alt} className="object-cover" fill priority sizes="100vw" src={image.src} />
          </Parallax>
          <div aria-hidden className="absolute inset-0 bg-dark/35" />
        </div>
      )}
      <div className={`container-page ${image ? 'relative -mt-24 pb-12' : 'section-sm'}`}>
        <div className={image ? 'max-w-3xl rounded-lg bg-background p-8 md:p-12' : 'max-w-3xl'}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <MaskedLines as="h1" className="type-display mt-4" lines={[title]} />
          {lede && <p className="type-lede mt-5">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
