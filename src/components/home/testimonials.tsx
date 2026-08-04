'use client'

import { useTranslations } from 'next-intl'
import { getTestimonials } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'

export function Testimonials({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.testimonials')
  const items = getTestimonials()
  if (items.length === 0) return null

  return (
    <Section background="cream-2">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h2 className="type-title max-w-2xl">{t('title')}</h2>

      {process.env.NODE_ENV !== 'production' && items.some((i) => i.isPlaceholder) && (
        <p className="mt-6 rounded-sm bg-sand/40 p-4 text-sm font-medium text-text">{t('devWarning')}</p>
      )}

      <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {items.map((item) => (
          <li className="min-w-72 flex-1 snap-start rounded-md bg-background p-8 md:min-w-96" key={item.id}>
            <blockquote className="font-heading text-xl leading-snug text-text">
              “{item.quote[locale]}”
            </blockquote>
            <cite className="mt-5 block text-xs tracking-widest text-muted uppercase not-italic">
              {item.author}
            </cite>
          </li>
        ))}
      </ul>
    </Section>
  )
}
