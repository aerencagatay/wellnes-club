'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { OliveBranch, Squiggle, SunMark } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { PointerLayer, PointerScene } from '@/components/motion/pointer-scene'
import { TextAnimate } from '@/components/motion/text-animate'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * HERO SAHNESİ — AÇILIŞ ÇEKİMİ
 * =============================================================================
 * Poster kompozisyonu (güneş → EDEN → WELLNESS CLUB → el yazısı → CTA) aynen
 * korunur; değişen tek şey artık DÜZ BİR YÜZEY OLMAMASI. Öğeler beş ayrı Z
 * düzleminde duruyor:
 *
 *     -260px  zeytin dalları      (uzak duvar)
 *        0px  marka tipografisi   (ana düzlem — "sergi"nin kendisi)
 *      +40px  el yazısı satırı
 *      +70px  eylem düğmeleri     (izleyiciye en yakın)
 *      +90px  güneş               (öne asılmış nesne)
 *
 * İki bağımsız kamera hareketi bu düzlemleri ayrıştırır:
 *
 *   1. İŞARETÇİ PARALAKSI — fare gezinirken katmanlar derinliklerine göre
 *      farklı miktarda kayar (bkz. pointer-scene.tsx).
 *   2. KAYDIRMA DOLLY'Sİ — sayfa aşağı gittikçe sahne izleyiciden UZAKLAŞIR ve
 *      solar. Hero "yukarı kayıp gitmez", geride kalır; bir sonraki bölüm onun
 *      önünden geçer. Bu, bir odadan diğerine geçme hissinin kaynağı.
 *
 * NEDEN AYRI BİR İSTEMCİ BİLEŞENİ: `hero-home.tsx` sunucuda kalır ve çeviriyi
 * orada çözer; buraya yalnızca çözülmüş dizeler iner. Böylece next-intl'in
 * mesaj sözlüğü istemci paketine girmez.
 */
export function HeroStage({
  handLine,
  cta,
  ctaSecondary,
}: {
  handLine: string
  cta: string
  ctaSecondary: string
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Sahnenin KENDİ üst kenarından çıkışını ölçer: 'start start' → hero tam
  // ekranda, 'end start' → hero tamamen yukarıda kalmış.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const eased = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 })

  // Dolly: 0 → -420px. Perspektif 1200px olduğu için bu, sahneyi görünür
  // biçimde küçültür ama kaybetmez — kamera geri çekiliyor, kesme yapmıyor.
  const dollyZ = useTransform(eased, [0, 1], [0, -420])
  // Solma sahnenin sonuna doğru başlar (0.45'e kadar tam opak): erken başlayan
  // bir solma, ziyaretçi daha hero'ya bakarken içeriği zayıflatırdı.
  const fade = useTransform(eased, [0, 0.45, 1], [1, 1, 0])

  return (
    <section
      className="field-forest grain relative flex min-h-svh items-center justify-center overflow-hidden"
      ref={ref}
    >
      <PointerScene className="w-full" perspective={1200}>
        <motion.div
          className="container-page relative flex flex-col items-center pt-36 pb-24 text-center md:pt-40 md:pb-28"
          style={
            reduced ? undefined : { translateZ: dollyZ, opacity: fade, transformStyle: 'preserve-3d' }
          }
        >
          {/* Zeytin dalları en uzak düzlemde ve en az hareket eden katman:
              uzak nesneler bakış açısı değişince daha az kayar. Mobilde
              gizlenirler — dar ekranda merkezi kompozisyona yer bırakmıyorlar. */}
          <PointerLayer className="pointer-events-none absolute inset-0" depth={-10} z={-260}>
            <OliveBranch className="absolute -left-6 top-1/4 hidden h-64 w-40 text-background/25 lg:block" />
            <OliveBranch className="absolute -right-6 bottom-1/4 hidden h-64 w-40 -scale-x-100 text-background/25 lg:block" />
          </PointerLayer>

          <PointerLayer depth={26} z={90}>
            <BlurFade duration={0.9} offset={12}>
              <SunMark className="ink-sun h-24 w-24 md:h-28 md:w-28" />
            </BlurFade>
          </PointerLayer>

          <PointerLayer className="mt-8" depth={9} z={0}>
            <h1 className="flex flex-col items-center">
              <TextAnimate
                as="span"
                by="character"
                className="type-display block text-background"
                delay={0.25}
                stagger={0.045}
              >
                EDEN
              </TextAnimate>
              {/* Posterin ikinci satırı: iki yanında kısa çizgi olan, geniş
                  aralıklı grotesk. Çizgiler `aria-hidden` — dekoratif. */}
              <BlurFade delay={0.75} offset={8}>
                <span className="mt-4 flex items-center gap-4 md:mt-5">
                  <span aria-hidden className="h-px w-8 bg-background/70 md:w-12" />
                  <span className="font-body text-[11px] font-semibold tracking-[0.42em] text-background uppercase md:text-sm md:tracking-[0.5em]">
                    Wellness Club
                  </span>
                  <span aria-hidden className="h-px w-8 bg-background/70 md:w-12" />
                </span>
              </BlurFade>
            </h1>
          </PointerLayer>

          <PointerLayer className="mt-10" depth={15} z={40}>
            {/* ÜÇÜNCÜ SES — posterin el yazısı satırı. Zeytin alanda kalem
                indigosu okunmaz, bu yüzden `.field-forest` kuralı el yazısını
                kreme çevirir (bkz. globals.css). */}
            <BlurFade delay={0.95} offset={10}>
              <p className="type-hand">{handLine}</p>
            </BlurFade>
            <BlurFade delay={1.05} offset={8}>
              <Squiggle className="ink-sun mx-auto mt-4 h-3 w-28" />
            </BlurFade>
          </PointerLayer>

          <PointerLayer className="mt-12" depth={20} z={70}>
            <BlurFade delay={1.2} offset={12}>
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <Button href="/kamplar" size="lg" variant="primary">
                  {cta}
                </Button>
                {/* Zeytin alan üzerinde `ghost` varyantı okunmaz (siyah hairline
                    + siyah metin). Alan-üstü sürüm burada elle kuruluyor: krem
                    hairline + krem metin, hover'da dolgu tersine döner. */}
                <Button
                  className="border-background text-background hover:bg-background hover:text-text"
                  href="/hakkimizda"
                  size="lg"
                  variant="ghost"
                >
                  {ctaSecondary}
                </Button>
              </div>
            </BlurFade>
          </PointerLayer>
        </motion.div>
      </PointerScene>

      {/* Kaydırma daveti — sahnenin en altında, nabız gibi inip kalkan ince bir
          çizgi. Hero tam ekran olduğu için aşağıda içerik olduğunun tek
          görsel ipucu bu. `aria-hidden`: klavye kullanıcısı zaten Tab ile
          ilerliyor, ekran okuyucuya "aşağı kaydır" demek anlamsız. */}
      <motion.span
        aria-hidden
        className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 bg-background/45"
        style={{ opacity: reduced ? 0.45 : fade }}
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 44, 0], opacity: [0, 1, 0] }}
          className="absolute inset-x-0 top-0 h-4 bg-background"
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.span>
    </section>
  )
}
