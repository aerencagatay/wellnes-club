import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { getCampBadge, type CampBadge } from '@/lib/utils/camp-status'
import { formatDateRange } from '@/lib/utils/dates'
import { formatPrice } from '@/lib/utils/price'
import { cn } from '@/lib/utils/cn'

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
  media = 'hero',
}: {
  camp: CampSession
  locale: AppLocale
  /**
   * Kartin gorseli: `'hero'` mekan fotografini 4:3 cercevede, `'poster'` ise
   * etkinligin duyuru posterini KARE cercevede gosterir.
   *
   * Oran varyanti sart: poster kare uretiliyor ve 4:3 bir cercevede
   * `object-cover` ile ust/alt kirpilirdi — tam da posterin markasini
   * (ustteki logo) ve konum satirini (alttaki "Asos, Canakkale") tasiyan
   * seritler. Kare cercevede kirpma sifir olur.
   *
   * `posterImage` tanimli degilse sessizce hero'ya duser: kart poster
   * olmayan bir kampta da calismaya devam eder.
   */
  media?: 'hero' | 'poster'
  /** Bu kart, sayfanın kendi `h1`'inden sonra ARA bir `h2` bölüm başlığı olmadan
   *  doğrudan yerleştirildiğinde (ör. `/kamplar` listesinin üst gridi, `/basvuru`daki
   *  özet kartı) `h2` verilmelidir — aksi halde başlık seviyeleri `h1 → h3` atlar.
   *  Bir `h2` bölüm başlığının (ör. "Yaklaşan Kamplar") altına yerleştirilen çağrılarda
   *  varsayılan `h3` doğru iç içe geçmeyi korur. */
  headingLevel?: 'h2' | 'h3'
}) {
  const t = useTranslations('camp')
  const badge = getCampBadge(camp)
  const showPoster = media === 'poster' && Boolean(camp.posterImage)
  const price = formatPrice(camp.priceFrom, camp.currency, locale)
  const Heading = headingLevel

  return (
    // Kart çerçevesi yok (brief §7-adım1): tam-taşma görsel + altında ince
    // `border-sand` ayırıcı. Rozet, fotoğrafın üzerine dolgu tabanlı ve keskin
    // köşeli olarak bindirilir.
    <article className="group flex flex-col">
      <Link
        className={cn(
          'relative overflow-hidden rounded-[var(--radius-media)]',
          showPoster ? 'aspect-square' : 'aspect-4/3',
        )}
        href={`/kamplar/${camp.slug}`}
      >
        <Image
          alt={camp.title[locale]}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={showPoster ? camp.posterImage! : camp.heroImage}
        />
        {/* Sarmalayıcıya ARTIK `bg-background` VERİLMİYOR: zemin tonun kendisine
            taşındı (bkz. ui/badge.tsx). Eskiden buradaki keskin köşeli krem
            kutu, yuvarlak rozetin köşelerinden taşıp poster üzerinde beyaz bir
            leke bırakıyordu. */}
        <div className="absolute top-0 left-0">
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
