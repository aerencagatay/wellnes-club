import { useTranslations } from 'next-intl'
import { SunMark, Squiggle, OliveBranch } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { TextAnimate } from '@/components/motion/text-animate'
import { Button } from '@/components/ui/button'

/**
 * HERO — POSTERİN WEB KARŞILIĞI.
 *
 * Kompozisyon doğrudan EDEN'in duyuru posterinden alınmıştır
 * (public/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg): zeytin alan,
 * tepede turuncu güneş, altında krem "EDEN" ve aralıklı "WELLNESS CLUB",
 * onun altında el yazısıyla bir satır. Sıra ve hiyerarşi birebir aynı.
 *
 * FOTOĞRAF YOK, LOGO GÖRSELİ DE YOK — ikisi de bilinçli:
 *
 *   - Fotoğraf: yön "stok yoga görseli" değil, "çağdaş wellness posteri"
 *     (prompt §Visual Direction). Bir fotoğraf hero'yu anında jenerik yapardı.
 *   - Logo görseli (`eden-logo.png`): krem zemin için üretilmiş bir PNG'dir;
 *     zeytin alanın üzerine konduğunda kendi kremi alanla çakışır. Marka adı
 *     bunun yerine CANLI TİPOGRAFİYLE kuruluyor — hem alanla aynı kremi
 *     paylaşır, hem `TextAnimate` ile harf harf belirebilir, hem de her
 *     ekranda keskin kalır.
 *
 * ERİŞİLEBİLİRLİK: marka adı tek bir `<h1>` içinde. `TextAnimate` metni görsel
 * olarak parçalara böler ama parçaları `aria-hidden` yapıp tam metni gizli tek
 * bir düğümde sunar (bkz. text-animate.tsx), yani ekran okuyucu "EDEN" duyar,
 * "E-D-E-N" değil.
 */
export function HeroHome() {
  const t = useTranslations('home.hero')

  return (
    <section className="field-forest grain relative flex min-h-svh items-center justify-center overflow-hidden">
      {/* Dekoratif zeytin dalları — alanın iki kenarında, kompozisyonu
          çerçeveleyen kolaj parçaları. Mobilde gizlenirler: dar ekranda
          merkezi kompozisyona yer bırakmıyorlar. */}
      <OliveBranch className="absolute -left-6 top-1/4 hidden h-64 w-40 text-background/25 lg:block" />
      <OliveBranch className="absolute -right-6 bottom-1/4 hidden h-64 w-40 -scale-x-100 text-background/25 lg:block" />

      <div className="container-page relative flex flex-col items-center pt-36 pb-24 text-center md:pt-40 md:pb-28">
        <BlurFade duration={0.9} offset={12}>
          {/* Güneş posterin en üstteki öğesi. Turuncu burada DEKORATİF —
              üzerine metin gelmez, dolayısıyla poster turuncusu
              (`--color-orange`) doğrudan kullanılabilir. */}
          <SunMark className="ink-sun h-24 w-24 md:h-28 md:w-28" />
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

        <BlurFade delay={0.95} offset={10}>
          {/* ÜÇÜNCÜ SES burada devreye giriyor — posterin el yazısı satırı.
              Zeytin alanda kalem indigosu okunmaz, bu yüzden `.field-forest`
              kuralı el yazısını kreme çevirir (bkz. globals.css). */}
          <p className="type-hand mt-10">{t('handLine')}</p>
        </BlurFade>

        <BlurFade delay={1.05} offset={8}>
          <Squiggle className="ink-sun mt-4 h-3 w-28" />
        </BlurFade>

        <BlurFade delay={1.2} offset={12}>
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
            <Button href="/kamplar" size="lg" variant="primary">
              {t('cta')}
            </Button>
            {/* Zeytin alan üzerinde `ghost` varyantı okunmaz (siyah hairline +
                siyah metin). Bu yüzden alan-üstü sürüm burada elle kuruluyor:
                krem hairline + krem metin, hover'da dolgu tersine döner. */}
            <Button
              className="border-background text-background hover:bg-background hover:text-text"
              href="/hakkimizda"
              size="lg"
              variant="ghost"
            >
              {t('ctaSecondary')}
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
