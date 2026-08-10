import { Leaf, Moon, Utensils } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/motion/reveal'

const ITEMS = [
  { key: 'deepenPractice', Icon: Leaf },
  { key: 'nourishBody', Icon: Utensils },
  { key: 'resetMind', Icon: Moon },
] as const

/**
 * Otel/mekan fotoğrafı yerine sade ikon + metin blokları (kullanıcı isteği,
 * 2026-08-10): ana sayfa artık mekan görseli taşımıyor, gerçek otel fotoğrafları
 * yalnızca kamp içeriğine (/kamplar, /mekan) tıklandığında görünüyor.
 */
export function BenefitsSection() {
  const t = useTranslations('home.benefits')

  return (
    <Section>
      <div className="mb-16 max-w-xl md:mb-24">
        <Eyebrow>{t('sectionEyebrow')}</Eyebrow>
        <h2 className="type-title">{t('sectionTitle')}</h2>
      </div>
      <div className="grid gap-16 md:grid-cols-3 md:gap-12">
        {ITEMS.map(({ key, Icon }) => (
          <Reveal key={key}>
            <Icon aria-hidden className="size-8 text-olive" strokeWidth={1.5} />
            <Eyebrow className="mt-6">{t(`${key}.eyebrow`)}</Eyebrow>
            <h3 className="type-title mt-2">{t(`${key}.title`)}</h3>
            <p className="type-lede mt-4">{t(`${key}.body`)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
