import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

// Not: `.eyebrow` ve `.type-lede` globals.css'te `@layer components` içinde tanımlıdır
// (Task 7'den beri) — bu yüzden Tailwind'in utilities katmanındaki text-* yardımcıları
// (ör. text-cream) artık bu sınıfların rengini ezebilir; katman sırası (theme → base →
// components → utilities) kaynak sırasından veya özgüllükten bağımsızdır. Koyu fotoğraf
// bindirmesi üzerinde yine de bu iki sınıfı KULLANMIYORUZ: varsayılan renkleri
// (accent-deep / body) açık zeminler içindir, burada kendi krem tonlu metin
// stillerimizi doğrudan kurmak paylaşılan sınıfları her yerde override etmekten
// daha basittir.
export function HeroHome() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-ink">
      <Image alt="" className="object-cover" fill priority sizes="100vw" src="/img/venue/hero.webp" />
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div className="container-page relative pt-32 pb-20 md:pb-28">
        <span className="mb-4 inline-block text-[10px] font-semibold tracking-[0.35em] text-cream/85 uppercase">
          {t('eyebrow')}
        </span>
        <h1 className="type-display max-w-3xl text-cream">{t('title')}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/90 md:text-lg">{t('lede')}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/kamplar" size="lg" variant="primary">
            {t('ctaPrimary')}
          </Button>
          <Button href="/mekan" size="lg" variant="secondary">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  )
}
