import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { MaskedLines } from '@/components/motion/masked-lines'
import { Parallax } from '@/components/motion/parallax'
import { Depth, Stage } from '@/components/motion/stage'

/**
 * İç sayfaların açılış bloğu.
 *
 * Ana sayfanın hero'su gibi burası da DÜZ BİR BAŞLIK DEĞİL, sığ bir sahne:
 * eyebrow, başlık ve lede üç ayrı Z düzleminde durur ve kaydırma boyunca
 * farklı hızlarda akar. Ana sayfadaki kadar derin değil (orada ±260px, burada
 * ±90px) — bir açılış çekimi değil, bir bölüm başlığı; mekân hissi olmalı ama
 * sahne kurmamalı.
 */
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
    // `bg-dark`: yalnızca görsel varyantı için. Görsel yoksa arka plan zaten
    // krem `background`dir ve bu sınıf eklenmez.
    //
    // Görselsiz varyantın üst boşluğu SABİT navbar'ın yüksekliğini karşılamak
    // zorunda: navbar `fixed` olduğu için akıştan çıkar ve buradaki padding
    // yetmezse başlık doğrudan navbar'ın altında kalır. Navbar iki satırlı ve
    // büyük (marka satırı 96/128px + nav şeridi 64px), bu yüzden değerler
    // ölçülen yüksekliğin biraz üzerinde tutulur.
    <section className={`relative ${image ? 'bg-dark' : 'pt-28 lg:pt-48'}`}>
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
      <Stage className={`container-page ${image ? 'relative -mt-24 pb-12' : 'section-sm'}`}>
        {/* `[transform-style:preserve-3d]` BURADA ŞART: CSS perspektifi
            kalıtsal değildir ve `preserve-3d` zinciri bir düğümde kırılırsa
            altındaki tüm katmanlar düzleşir. Bu ara sarmalayıcı (genişlik
            sınırı için var) o zincirin ortasında duruyor — sınıf olmadan
            `Depth` bileşenleri çalışır ama HİÇBİR derinlik üretmez. */}
        <div
          className={
            image
              ? 'max-w-3xl bg-background p-8 md:p-12 [transform-style:preserve-3d]'
              : 'max-w-3xl [transform-style:preserve-3d]'
          }
        >
          {/* Eyebrow en GERİDE ve en yavaş: küçük, ikincil bir etiket öne
              geldiğinde başlıkla yarışır. */}
          {eyebrow && (
            <Depth y={14} z={-90}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Depth>
          )}
          <Depth className="mt-4" y={-6} z={0}>
            <MaskedLines as="h1" className="type-display" lines={[title]} />
          </Depth>
          {lede && (
            <Depth className="mt-5" y={-22} z={60}>
              <p className="type-lede">{lede}</p>
            </Depth>
          )}
          {children}
        </div>
      </Stage>
    </section>
  )
}
