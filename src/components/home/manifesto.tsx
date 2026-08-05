import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { RevealGroup } from '@/components/motion/reveal'

const SECTIONS = ['01', '02', '03'] as const

export function Manifesto() {
  const t = useTranslations('home.manifesto')

  return (
    <Section>
      <div className="mx-auto max-w-[65ch]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title">{t('title')}</h2>
      </div>

      <RevealGroup
        className="mx-auto mt-16 flex max-w-3xl flex-col gap-14"
        itemClassName="grid gap-4 border-t border-sand pt-8 sm:grid-cols-[auto_1fr] sm:gap-10"
        stagger={0.12}
      >
        {SECTIONS.map((n) => (
          <Fragment key={n}>
            <span aria-hidden className="font-heading text-5xl text-muted-soft sm:text-6xl">{n}</span> {/* contrast-guard-allow: numara ≥24px, brief §2'nin istisnası geçerli */}
            <div>
              <h3 className="font-heading text-xl text-text">{t(`sections.${n}.title`)}</h3>
              <p className="type-lede mt-3">{t(`sections.${n}.body`)}</p>
            </div>
          </Fragment>
        ))}
      </RevealGroup>
    </Section>
  )
}
