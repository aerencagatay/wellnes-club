import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { getCampBadge } from '@/lib/utils/camp-status'
import { formatPrice } from '@/lib/utils/price'

// Mobilde ekran altına sabitlenir (`lg:hidden`), CampCtaCard'daki fiyat +
// buton bilgisini tekrarlar. WhatsAppFab bu barın üstünü kapatmasın diye
// FAB'a statik bir `bottom-24 lg:bottom-5` ofseti verildi (whatsapp-fab.tsx).
// Sayfanın son bölümüne bu barın yüksekliği kadar alt boşluk eklenmelidir.
export function CampCtaBar({ camp, locale }: { camp: CampSession; locale: AppLocale }) {
  const t = useTranslations('campDetail')
  const badge = getCampBadge(camp)
  const price = formatPrice(camp.priceFrom, camp.currency, locale)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-sand bg-background/95 px-5 py-4 backdrop-blur-[2px] lg:hidden">
      <span className="text-sm font-semibold text-text">
        {price} <span className="font-normal text-muted">{t('perPerson')}</span>
      </span>
      {badge === 'closed' ? (
        <Button disabled size="md" type="button">
          {t('closed')}
        </Button>
      ) : (
        <Button href={`/basvuru?kamp=${camp.slug}`} size="md">
          {badge === 'waitlist' ? t('joinWaitlist') : t('bookNow')}
        </Button>
      )}
    </div>
  )
}
