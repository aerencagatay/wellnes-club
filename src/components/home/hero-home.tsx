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
 * Logo bilinçli olarak MÜTEVAZI ölçekleniyor. Kaynak PNG'nin gerçek çizim
 * alanı 360x336 piksel; 2x (retina) ekranda tam netlik için görüntüleme
 * genişliği bunun yarısını, yani ~180px'i geçmemeli. 300px'lik üst sınır bu
 * kuralı bilerek bir miktar esnetir: suluboya güneş yumuşak kenarlı olduğu için
 * hafif büyütmeyi affeder, ama logodaki "EDEN" harfleri keskin — bu yüzden
 * daha da büyütmek görünür yumuşama yaratırdı.
 *
 * DAHA BÜYÜK BİR HERO LOGOSU İSTENİRSE: çözüm CSS'te değil, kaynakta —
 * en az 2048px genişliğinde yeni bir logo dosyası gerekir.
 */
const LOGO_WIDTH = 360
const LOGO_HEIGHT = 336

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
              className="h-auto w-[min(64vw,300px)]"
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
