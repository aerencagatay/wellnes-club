import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'
import { getCampBadge, type CampBadge } from '@/lib/utils/camp-status'
import { formatDateRange } from '@/lib/utils/dates'
import { formatPrice } from '@/lib/utils/price'

const BADGE_TONE: Record<CampBadge, 'olive' | 'coral' | 'amber' | 'neutral'> = {
  open: 'olive',
  'last-spots': 'coral',
  waitlist: 'amber',
  closed: 'neutral',
}

// Sunucu bileşeni: durum, fiyat ve WhatsApp bağlantısı istekte hesaplanır, JS'e gerek yok.
export function CampCtaCard({ camp, locale }: { camp: CampSession; locale: AppLocale }) {
  const t = useTranslations('campDetail')
  const tCamp = useTranslations('camp')
  const badge = getCampBadge(camp)
  const price = formatPrice(camp.priceFrom, camp.currency, locale)
  const whatsappUrl = buildWhatsAppUrl(t('whatsappMessage', { camp: camp.title[locale] }))
  // badge tek doğruluk kaynağıdır: 'open'/'last-spots' spotsLeft > 0'ı zaten garanti eder.
  const showSpotsLeft = badge === 'open' || badge === 'last-spots'

  return (
    <aside className="sticky top-24 rounded-md bg-cream p-8 shadow-[var(--shadow-soft)]">
      <Badge tone={BADGE_TONE[badge]}>{tCamp(`badge.${badge}`)}</Badge>

      <p className="mt-5 text-2xl font-semibold text-ink">
        {price} <span className="text-sm font-normal text-body">{t('perPerson')}</span>
      </p>
      <p className="mt-2 text-sm text-body">{formatDateRange(camp.startDate, camp.endDate, locale)}</p>

      <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-body">{t('duration')}</dt>
          <dd className="text-ink-3">{tCamp('nights', { count: camp.nights })}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body">{t('level')}</dt>
          <dd className="text-ink-3">{tCamp(`level.${camp.level}`)}</dd>
        </div>
      </dl>

      {showSpotsLeft && <p className="mt-4 text-xs text-coral">{t('spotsLeft', { count: camp.spotsLeft })}</p>}

      <div className="mt-6 flex flex-col gap-3">
        {badge === 'closed' ? (
          <Button className="w-full" disabled size="lg" type="button">
            {t('closed')}
          </Button>
        ) : (
          <Button className="w-full" href={`/basvuru?kamp=${camp.slug}`} size="lg">
            {badge === 'waitlist' ? t('joinWaitlist') : t('bookNow')}
          </Button>
        )}
        {whatsappUrl && (
          <Button className="w-full" href={whatsappUrl} size="lg" variant="ghost">
            <MessageCircle aria-hidden className="size-4" />
            {t('whatsappCta')}
          </Button>
        )}
      </div>
    </aside>
  )
}
