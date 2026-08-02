import { Check, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function VenueHighlights({ venue, locale }: { venue: Venue; locale: AppLocale }) {
  const t = useTranslations('venue')

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-2xl text-ink">
        <MapPin aria-hidden className="size-5 text-accent-deep" />
        {t('highlightsTitle')}
      </h2>
      {/* text-body-deep: bu bileşen yalnızca cream-2 zemininde kullanılır (bkz.
          mekan/page.tsx), düz gövde metni orada WCAG AA eşiğinin altında kalır
          (bkz. globals.css'teki -deep token yorumu). */}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-body-deep">
        {venue.highlights[locale].map((item) => (
          <li className="flex items-start gap-3 text-sm" key={item}>
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-deep" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
