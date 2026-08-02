import { BedDouble, Footprints, Salad, Sparkles, Users, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

const ICONS = [BedDouble, Sparkles, Salad, Users, Footprints, Wind]

export function IncludesList() {
  const t = useTranslations('home.includes')

  return (
    <Section background="cream-3">
      <div className="max-w-xl">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-section-title">{t('title')}</h2>
      </div>
      <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {ICONS.map((Icon, index) => {
          const n = index + 1
          return (
            <li className="flex items-start gap-4" key={n}>
              <Icon aria-hidden className="mt-1 size-6 shrink-0 text-accent-deep" />
              {/* text-body-deep: bu bölüm cream-3 zemininde (Section background="cream-3"),
                  düz gövde metni (body'den miras) orada WCAG AA eşiğinin altında kalır
                  (bkz. globals.css'teki -deep token yorumu). */}
              <p className="text-body-deep">{t(`items.${n}`)}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
