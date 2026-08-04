import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

export function Manifesto() {
  const t = useTranslations('home.manifesto')
  return (
    <Section>
      <div className="mx-auto max-w-[65ch]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title">{t('title')}</h2>
        <p className="type-lede mt-6">{t('body1')}</p>
        <p className="type-lede mt-4">{t('body2')}</p>
      </div>
    </Section>
  )
}
