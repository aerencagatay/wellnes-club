import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { getCampBadge, type CampBadge } from '@/lib/utils/camp-status'
import { formatDateRange } from '@/lib/utils/dates'
import { formatPrice } from '@/lib/utils/price'

const BADGE_TONE: Record<CampBadge, 'olive' | 'coral' | 'amber' | 'neutral'> = {
  open: 'olive',
  'last-spots': 'coral',
  waitlist: 'amber',
  closed: 'neutral',
}

export function CampCard({
  camp,
  locale,
  headingLevel = 'h3',
}: {
  camp: CampSession
  locale: AppLocale
  /** Bu kart, sayfanın kendi `h1`'inden sonra ARA bir `h2` bölüm başlığı olmadan
   *  doğrudan yerleştirildiğinde (ör. `/kamplar` listesinin üst gridi, `/basvuru`daki
   *  özet kartı) `h2` verilmelidir — aksi halde başlık seviyeleri `h1 → h3` atlar.
   *  Bir `h2` bölüm başlığının (ör. "Yaklaşan Kamplar") altına yerleştirilen çağrılarda
   *  varsayılan `h3` doğru iç içe geçmeyi korur. */
  headingLevel?: 'h2' | 'h3'
}) {
  const t = useTranslations('camp')
  const badge = getCampBadge(camp)
  const price = formatPrice(camp.priceFrom, camp.currency, locale)
  const Heading = headingLevel

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-background shadow-[var(--shadow-soft)]">
      <Link className="relative aspect-3/2 overflow-hidden" href={`/kamplar/${camp.slug}`}>
        <Image
          alt={camp.title[locale]}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={camp.heroImage}
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <Badge tone={BADGE_TONE[badge]}>{t(`badge.${badge}`)}</Badge>
          <span className="text-xs tracking-widest text-muted uppercase">{t(`program.${camp.program}`)}</span>
        </div>
        <Heading className="mt-4 font-heading text-xl text-text">
          <Link className="hover:text-olive" href={`/kamplar/${camp.slug}`}>
            {camp.title[locale]}
          </Link>
        </Heading>
        <p className="mt-2 text-sm">{formatDateRange(camp.startDate, camp.endDate, locale)}</p>
        <p className="mt-3 line-clamp-3 text-sm">{camp.summary[locale]}</p>
        <div className="mt-auto flex items-end justify-between pt-6">
          <span className="text-sm">
            <span className="font-semibold text-text">{price}</span>{' '}
            <span className="text-muted">{t('priceFromSuffix')}</span>
          </span>
          <span className="text-xs text-muted">{t('nights', { count: camp.nights })}</span>
        </div>
      </div>
    </article>
  )
}
