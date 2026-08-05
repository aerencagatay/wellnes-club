import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MaskedLines } from '@/components/motion/masked-lines'
import { Button } from '@/components/ui/button'

// Not: `.type-eyebrow` ve `.type-lede` globals.css'te `@layer components` içinde tanımlıdır
// (Task 7'den beri) — bu yüzden Tailwind'in utilities katmanındaki text-* yardımcıları
// (ör. text-background) artık bu sınıfların rengini ezebilir; katman sırası (theme → base →
// components → utilities) kaynak sırasından veya özgüllükten bağımsızdır. Koyu fotoğraf
// bindirmesi üzerinde yine de bu iki sınıfı KULLANMIYORUZ: varsayılan renkleri
// (muted) açık zeminler içindir, burada kendi krem tonlu metin
// stillerimizi doğrudan kurmak paylaşılan sınıfları her yerde override etmekten
// daha basittir.
//
// Video yok: `site` yapılandırmasında (`src/lib/config/site.ts`) henüz bir `heroVideo`
// alanı tanımlı değil ve gerçek bir video dosyası da yok — brief bu durumda video
// uydurmayı değil, fallback fotoğrafı ister (task-5 brief §Step 1). Fotoğraf istemcinin
// gerçek çekimi: kıyı şeridindeki havuzdan Assos köyü/tepeleri manzarasına bakış —
// yer/tarih iddiası taşımayan, salt atmosfer görseli (bkz. task-5-report.md).
const HERO_IMAGE = '/img/açılış sayfası main photo.jpeg'

export function HeroHome() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-dark grain">
      <Image alt={t('imageAlt')} className="object-cover" fill priority sizes="100vw" src={HERO_IMAGE} />
      <div aria-hidden className="absolute inset-0 bg-dark/35" />
      <div className="container-page relative pt-32 pb-20 md:pb-28">
        <span className="mb-6 inline-block text-[10px] font-semibold tracking-[0.35em] text-background/85 uppercase">
          {t('eyebrow')}
        </span>
        <MaskedLines
          as="h1"
          className="type-display max-w-3xl text-background"
          lines={[t('titleLine1'), t('titleLine2')]}
        />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-background/90 md:text-lg">{t('subtitle')}</p>
        <p className="mt-8 text-[11px] tracking-[0.25em] text-background/75 uppercase">{t('tags')}</p>
        <div className="mt-10">
          <Button href="/kamplar" size="lg" variant="primary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
