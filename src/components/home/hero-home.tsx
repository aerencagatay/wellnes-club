import { useTranslations } from 'next-intl'
import { AuroraBackdrop } from '@/components/motion/aurora-backdrop'
import { BlurFade } from '@/components/motion/blur-fade'
import { TextAnimate } from '@/components/motion/text-animate'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'

/**
 * FOTOĞRAFSIZ HERO (kullanıcı isteği, 2026-08-14).
 *
 * Önceki sürüm tam ekran bir fotoğraf + üzerine koyu bindirme kullanıyordu.
 * Artık arka planda görsel YOK: zemin sitenin kendi kremi (`bg-background`),
 * üzerinde yalnızca `AuroraBackdrop`'un paletten çıkmayan iki yavaş ışık havuzu
 * var. Bunun iki somut sonucu var:
 *
 *   1. Sayfanın LCP'si artık bir görsel değil metin — hero'da `priority`'li bir
 *      `next/image` kalmadığı için ilk boyama ağdan bağımsızlaştı.
 *   2. Metin koyu fotoğraf üzerinde değil açık krem üzerinde durduğundan,
 *      eski dosyadaki "kendi krem tonlu metin stillerimizi kur" istisnası
 *      gereksizleşti: burada paylaşılan `.type-eyebrow` / `Eyebrow` ve normal
 *      `text-text` / `text-muted` renkleri doğrudan kullanılabilir.
 */

/**
 * Marka adının ölçeği bilinçli olarak `.type-display`in (maks. 5.5rem) ÜSTÜNDE:
 * ana sayfanın hakim öğesi tipografinin kendisi olsun isteniyor.
 *
 * `max-w-[7em]` bir stil tercihi değil, DÜZEN KİLİDİDİR: genişlik `em`
 * cinsinden olduğu için punto ile birlikte ölçeklenir ve her ekran genişliğinde
 * aynı satır bölünmesini garanti eder. Montserrat Light'ta büyük harf
 * "WELLNESS" ≈ 5.5em, en kısa iki kelimelik kombinasyon ("EDEN WELLNESS" /
 * "WELLNESS CLUB") ≈ 8.6em; 7em tam bu ikisinin arasında kalır, yani satır
 * başına HER ZAMAN tek kelime düşer ve marka üç satırlık sabit bir blok olarak
 * okunur. Aksi halde ara genişliklerde "EDEN WELLNESS / CLUB" gibi dengesiz
 * bir kırılma oluşurdu.
 *
 * Alt sınır 2.25rem: en dar ekranda (320px) 7em ≈ 246px, `container-page`'in
 * 24px'lik iç boşluğundan sonra kalan 272px'e sığar — yani yatay taşma yok.
 */
const BRAND_SCALE = 'text-[clamp(2.25rem,11vw,9rem)]'

export function HeroHome() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background grain">
      <AuroraBackdrop />
      {/* Navbar sabit konumlu ve ~h-28/32 — üstteki `pt` onun altından başlamak
          için değil, başlığın navbar'a YAPIŞMAMASI için cömert tutuluyor. */}
      <div className="container-page relative flex flex-col items-center pt-36 pb-24 text-center md:pt-44 md:pb-28">
        <BlurFade delay={0.05} offset={12}>
          <Eyebrow className="text-olive">{t('eyebrow')}</Eyebrow>
        </BlurFade>

        <TextAnimate
          as="h1"
          by="word"
          className={`mt-8 max-w-[7em] font-heading font-extralight leading-[0.95] tracking-[0.02em] text-text ${BRAND_SCALE}`}
          delay={0.15}
          duration={0.9}
          stagger={0.12}
        >
          {t('brand')}
        </TextAnimate>

        {/* Tek satırlık destek metni — hero'da paragraf yok, ağırlık başlıkta kalıyor. */}
        <BlurFade delay={0.65} offset={14}>
          <p className="type-lede mt-10 max-w-md text-balance">{t('subtitle')}</p>
        </BlurFade>

        <BlurFade delay={0.85} offset={14}>
          <div className="mt-10">
            <Button href="/kamplar" shimmer size="lg" variant="primary">
              {t('cta')}
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
