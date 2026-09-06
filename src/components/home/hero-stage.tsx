'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { InteractiveSun } from '@/components/art/interactive-sun'
import { DrawIn } from '@/components/art/draw-in'
import { OliveBranch, Squiggle } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { TextAnimate } from '@/components/motion/text-animate'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * HERO SAHNESİ — AÇILIŞ ÇEKİMİ
 * =============================================================================
 * Poster kompozisyonu (güneş → EDEN → WELLNESS CLUB → el yazısı → CTA) korunur.
 *
 * TEK BİR ŞEY HAREKET EDER: GÜNEŞ.
 *
 * Önceki sürümde beş katmanın hepsi fareyi takip ediyordu (işaretçi
 * paralaksı). Kullanıcı geri bildirimi (2026-09-06): metinlerin de kayması
 * dikkati dağıtıyor, yalnızca güneş takip etmeli. Bu yalnızca bir tercih
 * değil, daha doğru bir tasarım: BİR nesne hareket ettiğinde o nesne canlı
 * görünür; HER ŞEY hareket ettiğinde sayfa oynak görünür. Güneş artık
 * kompozisyonun tek "yaşayan" öğesi ve amblem bu sayede öne çıkıyor
 * (bkz. art/interactive-sun.tsx).
 *
 * Metinler, zeytin dalları ve düğmeler artık SABİT. Tek istisna kaydırma
 * dolly'si: sayfa aşağı gittikçe SAHNENİN TAMAMI izleyiciden uzaklaşır ve
 * solar — hero "yukarı kayıp gitmez", geride kalır ve bir sonraki bölüm onun
 * önünden geçer. Bu, odadan odaya geçme hissinin kaynağı ve fareyle ilgisi
 * yok.
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
      style={reduced ? undefined : { perspective: '1200px' }}
    >
      <motion.div
        className="container-page relative flex flex-col items-center pt-36 pb-24 text-center md:pt-40 md:pb-28"
        style={reduced ? undefined : { translateZ: dollyZ, opacity: fade, transformStyle: 'preserve-3d' }}
      >
        {/* Zeytin dalları SABİT dekor — kompozisyonu çerçeveliyorlar.
            Mobilde gizlenirler: dar ekranda merkezi kompozisyona yer
            bırakmıyorlar. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <OliveBranch className="absolute -left-6 top-1/4 hidden h-64 w-40 text-background/25 lg:block" />
          <OliveBranch className="absolute -right-6 bottom-1/4 hidden h-64 w-40 -scale-x-100 text-background/25 lg:block" />
        </div>

        {/* SAYFANIN TEK CANLI ÖĞESİ. Yakınlığa göre büyür, saçakları imlece
            uzanır, tıklanınca patlar. */}
        <BlurFade duration={0.9} offset={12}>
          <InteractiveSun className="ink-sun h-28 w-28 md:h-32 md:w-32" />
        </BlurFade>

        <h1 className="mt-8 flex flex-col items-center">
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

        {/* ÜÇÜNCÜ SES — posterin el yazısı satırı. Zeytin alanda kalem
            indigosu okunmaz, bu yüzden `.field-forest` kuralı el yazısını
            kreme çevirir (bkz. globals.css). */}
        <BlurFade delay={0.95} offset={10}>
          <p className="type-hand mt-10">{handLine}</p>
        </BlurFade>

        <BlurFade delay={1.05} offset={8}>
          <DrawIn className="ink-sun mt-4" delay={0.15}>
            <Squiggle className="h-3 w-28" />
          </DrawIn>
        </BlurFade>

        <BlurFade delay={1.2} offset={12}>
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
            <Button href="/kamplar" size="lg" variant="primary">
              {cta}
            </Button>
            {/* Zeytin alan üzerinde `ghost` varyantı okunmaz (siyah hairline +
                siyah metin). Alan-üstü sürüm burada elle kuruluyor: krem
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
      </motion.div>

      {/* Kaydırma daveti — sahnenin en altında, nabız gibi inip kalkan ince bir
          çizgi. Hero tam ekran olduğu için aşağıda içerik olduğunun tek görsel
          ipucu bu. `aria-hidden`: klavye kullanıcısı zaten Tab ile ilerliyor,
          ekran okuyucuya "aşağı kaydır" demek anlamsız. */}
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
