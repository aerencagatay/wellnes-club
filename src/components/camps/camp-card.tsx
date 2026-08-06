import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { getCampBadge, type CampBadge } from '@/lib/utils/camp-status'
import { formatDateRange } from '@/lib/utils/dates'
import { formatPrice } from '@/lib/utils/price'

const BADGE_TONE: Record<CampBadge, 'olive' | 'sand-fill' | 'olive-outline' | 'neutral'> = {
  open: 'olive',
  'last-spots': 'sand-fill',
  waitlist: 'olive-outline',
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
    // Kart çerçevesi yok (brief §7-adım1): tam-taşma görsel + altında ince
    // `border-sand` ayırıcı. Rozet, fotoğrafın üzerine dolgu tabanlı ve keskin
    // köşeli olarak bindirilir.
    <article className="group flex flex-col">
      <Link className="relative aspect-4/3 overflow-hidden" href={`/kamplar/${camp.slug}`}>
        <Image
          alt={camp.title[locale]}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={camp.heroImage}
        />
        {/* `olive-outline`/`neutral` rozet tonları dolgusuz (şeffaf zemin) —
            fotoğrafın üzerinde brief'in "dolgu tabanlı" gereksinimini karşılamak
            için sarmalayıcıya `bg-background` verilir. Rozetin kendi kutusuyla
            aynı boyutta olduğundan dolu tonlarda (olive/sand-fill) görünmez
            kalır; şeffaf tonlarda ise rozetin iç alanı arkadan kremle dolar. */}
        <div className="absolute top-4 left-4 bg-background">
          <Badge tone={BADGE_TONE[badge]}>{t(`badge.${badge}`)}</Badge>
        </div>
      </Link>
      <div className="flex flex-1 flex-col border-b border-sand pt-5 pb-6">
        <p className="type-eyebrow">
          {formatDateRange(camp.startDate, camp.endDate, locale)}
          <span aria-hidden className="mx-2">
            ·
          </span>
          {t(`program.${camp.program}`)}
        </p>
        <Heading className="mt-3 font-heading text-2xl text-text">
          <Link className="hover:text-olive" href={`/kamplar/${camp.slug}`}>
            {camp.title[locale]}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-2 text-sm text-muted">{camp.summary[locale]}</p>
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
