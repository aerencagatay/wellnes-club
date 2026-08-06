import { BedDouble, Footprints, Salad, Sparkles, Users, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { RevealGroup } from '@/components/motion/reveal'

const ICONS = [BedDouble, Sparkles, Salad, Users, Footprints, Wind]

export function IncludesList() {
  const t = useTranslations('home.includes')

  return (
    <Section background="surface">
      <div className="max-w-xl">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title">{t('title')}</h2>
      </div>
      <ul className="mt-14 grid list-none gap-x-12 md:grid-cols-2">
        <RevealGroup
          itemAs="li"
          itemClassName="flex items-start gap-4 border-t border-sand py-6 first:border-t-0 md:py-8 md:[&:nth-child(2)]:border-t-0"
        >
          {ICONS.map((Icon, index) => {
            const n = index + 1
            return (
              <Fragment key={n}>
                <Icon aria-hidden className="mt-1 size-6 shrink-0 text-olive" />
                {/* text-muted: bu bölüm surface zemininde (Section background="surface"),
                    düz gövde metni (body'den miras) orada WCAG AA eşiğinin altında kalır
                    (bkz. globals.css'teki --color-muted token yorumu). */}
                <p className="text-muted">{t(`items.${n}`)}</p>
              </Fragment>
            )
          })}
        </RevealGroup>
      </ul>
    </Section>
  )
}
