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

export function CampCard({ camp, locale }: { camp: CampSession; locale: AppLocale }) {
  const t = useTranslations('camp')
  const badge = getCampBadge(camp)
  const price = formatPrice(camp.priceFrom, camp.currency, locale)

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-cream shadow-[var(--shadow-soft)]">
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
          <span className="text-xs tracking-widest text-body uppercase">{t(`program.${camp.program}`)}</span>
        </div>
        <h3 className="mt-4 font-heading text-xl text-ink">
          <Link className="hover:text-accent-deep" href={`/kamplar/${camp.slug}`}>
            {camp.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 text-sm">{formatDateRange(camp.startDate, camp.endDate, locale)}</p>
        <p className="mt-3 line-clamp-3 text-sm">{camp.summary[locale]}</p>
        <div className="mt-auto flex items-end justify-between pt-6">
          <span className="text-sm">
            <span className="font-semibold text-ink">{price}</span>{' '}
            <span className="text-body">{t('priceFromSuffix')}</span>
          </span>
          <span className="text-xs text-body">{t('nights', { count: camp.nights })}</span>
        </div>
      </div>
    </article>
  )
}
