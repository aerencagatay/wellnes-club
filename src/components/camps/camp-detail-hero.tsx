import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession, Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { MaskedLines } from '@/components/motion/masked-lines'
import { Parallax } from '@/components/motion/parallax'
import { formatDateRange } from '@/lib/utils/dates'

// `.type-eyebrow`/`.type-lede` artık globals.css'te `@layer components` içindedir (Task 7),
// bu yüzden Tailwind'in text-* yardımcıları bunların rengini ezebilir. Koyu fotoğraf
// bindirmesi üzerinde yine de bu sınıflar KULLANILMIYOR; ayrıntılı gerekçe için bkz.
// hero-home.tsx.
export function CampDetailHero({ camp, venue, locale }: { camp: CampSession; venue: Venue; locale: AppLocale }) {
  const t = useTranslations('camp')

  return (
    <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-dark">
      {/* `-top-10 -bottom-10` iç kapsayıcı `Parallax`'ın ±40px dikey kaymasını
          kırpma sınırının dışında karşılar (bkz. page-hero.tsx'teki aynı desen) —
          aksi halde kayma sırasında zeminin altında/üstünde boşluk açılırdı. */}
      <Parallax amount={40} className="absolute inset-x-0 -top-10 -bottom-10">
        <Image alt="" className="object-cover" fill priority sizes="100vw" src={camp.heroImage} />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-dark/45" />
      <div className="container-page relative pt-32 pb-14">
        <span className="mb-4 inline-block text-[10px] font-semibold tracking-[0.35em] text-background/85 uppercase">
          {t(`program.${camp.program}`)}
        </span>
        <MaskedLines as="h1" className="type-display max-w-3xl text-background" lines={[camp.title[locale]]} />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-background/90">
          <span>{formatDateRange(camp.startDate, camp.endDate, locale)}</span>
          <span aria-hidden className="size-1 rounded-full bg-background/50" />
          <span>{venue.name}</span>
          <span aria-hidden className="size-1 rounded-full bg-background/50" />
          <span>{t('nights', { count: camp.nights })}</span>
        </div>
      </div>
    </section>
  )
}
