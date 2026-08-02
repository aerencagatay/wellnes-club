import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/section'

// Basın logosu veya ödül rozeti yok — burada yalnızca mekan verisinden
// (bkz. src/content/venues.ts) doğrulanabilir dört gerçek gösterilir.
export function TrustStrip() {
  const t = useTranslations('home.trust')
  const items = ['assos', 'bay', 'groupSize', 'stone'] as const
  return (
    <Section background="cream-2" size="sm">
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((key) => (
          <li className="text-center" key={key}>
            <p className="font-heading text-2xl text-ink">{t(`${key}.value`)}</p>
            {/* text-body-deep: bu bölüm cream-2 zemininde, düz text-body orada WCAG AA
                eşiğinin altında kalır (bkz. globals.css'teki -deep token yorumu). */}
            <p className="mt-1 text-xs tracking-widest text-body-deep uppercase">{t(`${key}.label`)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
