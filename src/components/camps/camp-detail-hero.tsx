import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession, Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { formatDateRange } from '@/lib/utils/dates'

// Koyu fotoğraf bindirmesi üzerinde `.eyebrow`/`.type-lede` KULLANILMIYOR
// (katmansız kurallar Tailwind'in text-cream yardımcısını ezer); bkz. hero-home.tsx.
export function CampDetailHero({ camp, venue, locale }: { camp: CampSession; venue: Venue; locale: AppLocale }) {
  const t = useTranslations('camp')

  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-ink">
      <Image alt="" className="object-cover" fill priority sizes="100vw" src={camp.heroImage} />
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div className="container-page relative pt-32 pb-14">
        <span className="mb-4 inline-block text-[10px] font-semibold tracking-[0.35em] text-cream/85 uppercase">
          {t(`program.${camp.program}`)}
        </span>
        <h1 className="type-display max-w-3xl text-cream">{camp.title[locale]}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/90">
          <span>{formatDateRange(camp.startDate, camp.endDate, locale)}</span>
          <span aria-hidden className="size-1 rounded-full bg-cream/50" />
          <span>{venue.name}</span>
          <span aria-hidden className="size-1 rounded-full bg-cream/50" />
          <span>{t('nights', { count: camp.nights })}</span>
        </div>
      </div>
    </section>
  )
}
