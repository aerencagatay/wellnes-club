import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AuroraBackdrop } from '@/components/motion/aurora-backdrop'
import { BlurFade } from '@/components/motion/blur-fade'
import { Button } from '@/components/ui/button'

/**
 * FOTOĞRAFSIZ HERO — zemin sitenin kendi kremi (`bg-background`), üzerinde
 * yalnızca `AuroraBackdrop`'un paletten çıkmayan iki yavaş ışık havuzu.
 *
 * Marka artık YAZI DEĞİL, LOGO (kullanıcı isteği, 2026-08-14): logonun kendisi
 * zaten "EDEN / WELLNESS CLUB" metnini taşıyor, bu yüzden eski `TextAnimate`
 * kelime animasyonu kaldırıldı — ikisi bir arada olsaydı ekranda aynı marka adı
 * iki kez görünürdü.
 *
 * ERİŞİLEBİLİRLİK / SEO: logo bir görsel olsa da sayfanın `h1`'i KORUNUR —
 * `<h1>` etiketi duruyor, içindeki `Image`'ın `alt` metni marka adını taşıyor.
 * Böylece ekran okuyucular ve arama motorları için sayfanın başlığı hâlâ
 * "EDEN Wellness Club"; yalnızca görsel sunum değişti.
 */

/**
 * Görüntüleme genişliğinin üst sınırı kaynağın çözünürlüğüne BAĞLIDIR, keyfi
 * değil: 2x (retina) ekranda tam netlik için görüntüleme genişliği kaynağın
 * yarısını geçmemeli. Kaynak 662px olduğuna göre güvenli tavan ~331px.
 *
 * Dosya, çizimin GERÇEK sınırlarına kırpılmıştır (çevresinde boşluk yoktur) —
 * bu yüzden 340px, öncekinin 460px'i kadar yer kaplar ama tamamı çizimdir.
 *
 * KIRPMANIN İKİNCİ İŞLEVİ — HİZALAMA: tuval çizimin sınır kutusu olduğu için
 * görselin merkezi TANIM GEREĞİ marka yazısının merkezidir. Böylece altındaki
 * CTA butonu `items-center` ile ortalandığında logonun yazısıyla da hizalanır.
 * Önceki sürümde tuvalde asimetrik boşluk vardı ve yazı merkezden 22.5px
 * kaymıştı; buton gözle görülür biçimde hizasız duruyordu.
 */
const LOGO_WIDTH = 662
const LOGO_HEIGHT = 621

export function HeroHome() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background grain">
      <AuroraBackdrop />
      {/* Navbar sabit konumlu ve ~h-28/32 — üstteki `pt` onun altından başlamak
          için değil, içeriğin navbar'a YAPIŞMAMASI için cömert tutuluyor. */}
      {/* Hero artık YALNIZCA logo + tek bir eylemden ibaret (kullanıcı isteği,
          2026-08-14): üstteki "İSTANBUL · EGE · DOĞA" eyebrow'u ve "Şehirden
          uzaklaş…" destek satırı kaldırıldı. Logo zaten markanın ne olduğunu
          söylüyor; ekranda ondan başka bir şey olmaması bilinçli. */}
      <div className="container-page relative flex flex-col items-center pt-36 pb-24 text-center md:pt-44 md:pb-28">
        <BlurFade delay={0.05} duration={0.9} offset={18}>
          <h1>
            <Image
              alt={t('brand')}
              className="h-auto w-[min(72vw,340px)]"
              height={LOGO_HEIGHT}
              priority
              src="/img/eden-logo.png"
              width={LOGO_WIDTH}
            />
          </h1>
        </BlurFade>

        <BlurFade delay={0.45} offset={14}>
          <div className="mt-12">
            <Button href="/kamplar" shimmer size="lg" variant="primary">
              {t('cta')}
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
