import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { BenefitBlock } from './benefit-block'

// Görseller mekan setinden (src/content/venues.ts galerisi) yeniden kullanılır;
// yeni bir görsel yolu icat edilmez.
const IMAGES = {
  deepenPractice: '/img/venue/balkon.webp',
  nourishBody: '/img/venue/bahce.webp',
  resetMind: '/img/venue/havuz.webp',
} as const

export function BenefitsSection() {
  const t = useTranslations('home.benefits')

  return (
    <Section>
      <div className="mb-16 max-w-xl md:mb-24">
        <Eyebrow>{t('sectionEyebrow')}</Eyebrow>
        <h2 className="type-title">{t('sectionTitle')}</h2>
      </div>
      <div className="flex flex-col gap-24 md:gap-32">
        <BenefitBlock
          body={t('deepenPractice.body')}
          eyebrow={t('deepenPractice.eyebrow')}
          image={{ src: IMAGES.deepenPractice, alt: t('deepenPractice.imageAlt') }}
          title={t('deepenPractice.title')}
        />
        <BenefitBlock
          body={t('nourishBody.body')}
          eyebrow={t('nourishBody.eyebrow')}
          image={{ src: IMAGES.nourishBody, alt: t('nourishBody.imageAlt') }}
          reversed
          title={t('nourishBody.title')}
        />
        <BenefitBlock
          body={t('resetMind.body')}
          eyebrow={t('resetMind.eyebrow')}
          image={{ src: IMAGES.resetMind, alt: t('resetMind.imageAlt') }}
          title={t('resetMind.title')}
        />
      </div>
    </Section>
  )
}
