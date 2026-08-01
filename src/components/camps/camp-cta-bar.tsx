import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

// Mobilde ekran altına sabitlenir (`lg:hidden`), CampCtaCard'daki fiyat +
// buton bilgisini tekrarlar. WhatsAppFab bu barın üstünü kapatmasın diye
// FAB'a statik bir `bottom-24 lg:bottom-5` ofseti verildi (whatsapp-fab.tsx).
// Sayfanın son bölümüne bu barın yüksekliği kadar alt boşluk eklenmelidir.
export function CampCtaBar({ camp, locale }: { camp: CampSession; locale: AppLocale }) {
  const t = useTranslations('campDetail')
  const price = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: camp.currency,
    maximumFractionDigits: 0,
  }).format(camp.priceFrom)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-cream/95 px-5 py-4 backdrop-blur-[2px] lg:hidden">
      <span className="text-sm font-semibold text-ink">
        {price} <span className="font-normal text-body">{t('perPerson')}</span>
      </span>
      {camp.status === 'closed' ? (
        <Button disabled size="md" type="button">
          {t('closed')}
        </Button>
      ) : (
        <Button href={`/basvuru?kamp=${camp.slug}`} size="md">
          {camp.status === 'waitlist' ? t('joinWaitlist') : t('bookNow')}
        </Button>
      )}
    </div>
  )
}
