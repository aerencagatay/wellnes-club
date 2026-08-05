import { useTranslations } from 'next-intl'
import { getTestimonials } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'
import { RevealGroup } from '@/components/motion/reveal'

export function Testimonials({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.testimonials')
  const items = getTestimonials()
  if (items.length === 0) return null

  return (
    <Section background="surface">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h2 className="type-title max-w-2xl">{t('title')}</h2>

      {process.env.NODE_ENV !== 'production' && items.some((i) => i.isPlaceholder) && (
        <p className="mt-6 max-w-2xl rounded-sm bg-sand/40 p-4 text-sm font-medium text-text" data-testid="testimonials-dev-warning">
          {t('devWarning')}
        </p>
      )}

      {/* Kart yok, ayırıcı ince bir üst çizgi — bkz. brief §4.7/step 7. */}
      <RevealGroup className="mt-14 flex flex-col" itemClassName="border-t border-sand py-10 first:pt-0" stagger={0.1}>
        {items.map((item) => (
          <figure key={item.id}>
            <blockquote className="font-heading text-2xl leading-snug text-text md:text-3xl">
              “{item.quote[locale]}”
            </blockquote>
            <figcaption className="mt-5 text-xs tracking-widest text-muted uppercase">{item.author}</figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Section>
  )
}
