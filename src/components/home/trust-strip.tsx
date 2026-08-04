import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/section'

// Basın logosu veya ödül rozeti yok — burada yalnızca mekan verisinden
// (bkz. src/content/venues.ts) doğrulanabilir dört gerçek gösterilir.
export function TrustStrip() {
  const t = useTranslations('home.trust')
  const items = ['assos', 'bay', 'groupSize', 'stone'] as const
  return (
    <Section background="surface" size="sm">
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((key) => (
          <li className="text-center" key={key}>
            <p className="font-heading text-2xl text-text">{t(`${key}.value`)}</p>
            {/* text-muted: bu bölüm cream-2 zemininde, düz text-muted orada WCAG AA
                eşiğinin altında kalır (bkz. globals.css'teki --color-muted token yorumu). */}
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">{t(`${key}.label`)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
