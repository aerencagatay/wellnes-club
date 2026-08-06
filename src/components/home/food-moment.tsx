import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/motion/reveal'

const FOOD_IMAGE = '/img/yemek fotoğrafı.jpeg'

/**
 * Otel/mekan fotoğrafı DEĞİL — sofra/yemek anını gösteren tek gerçek fotoğraf
 * (kullanıcı isteği, 2026-08-06: ana sayfada otel fotoğrafı yalnızca gerçek
 * mekan/kamp detay sayfalarında görünmeli). `VenuePreview`'in yerini alan,
 * galeri/lightbox içermeyen sade bir görsel ara bölüm.
 */
export function FoodMoment() {
  const t = useTranslations('home.foodMoment')

  return (
    <Section size="sm">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
          <div className="relative aspect-4/3 overflow-hidden">
            <Image alt={t('alt')} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={FOOD_IMAGE} />
          </div>
          <div>
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h2 className="type-title">{t('title')}</h2>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
