import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getFutureEvents } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { RevealGroup } from '@/components/motion/reveal'

// Editorial mozaik — kalabalık kart grid'i değil (bkz. brief §4.6). İlk
// etkinlik geniş, kalanı dar: büyük görsel + isim + tek satır özet.
export function ComingSoon({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.comingSoon')
  const events = getFutureEvents()

  return (
    <Section background="dark">
      <div className="max-w-2xl">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title">{t('title')}</h2>
        <p className="type-lede mt-5">{t('lede')}</p>
      </div>

      <RevealGroup
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        itemClassName="group [&:first-child]:sm:col-span-2 [&:first-child]:lg:col-span-2"
      >
        {events.map((event, index) => (
          <div key={event.slug}>
            <div className={`relative overflow-hidden ${index === 0 ? 'aspect-16/10' : 'aspect-4/3'}`}>
              <Image
                alt={event.title[locale]}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                src={event.image}
              />
            </div>
            <p className="mt-4 font-heading text-xl text-background">{event.title[locale]}</p>
            <p className="mt-1 text-sm text-sand">{event.summary[locale]}</p> {/* contrast-guard-allow: koyu zeminde kum metin 9.05:1 (brief §2) */}
          </div>
        ))}
      </RevealGroup>
    </Section>
  )
}
