'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { getCampBySlug, getTestimonials } from '@/content'
import type { Localized } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { BlurFade } from '@/components/motion/blur-fade'
import { cn } from '@/lib/utils/cn'

/**
 * ÜYE DENEYİMLERİ duvarı.
 *
 * Düzen bilinçli olarak bir sosyal medya akışını TAKLİT ETMEZ (avatar + kolon +
 * kartlar). EDEN'in editoryal sistemi burada da geçerli: yumuşak yuvarlatılmış
 * köşeler, kum çizgileri, ince Montserrat, renk yerine boşluk ve ölçek ile
 * vurgu (köşe/gölge değerleri globals.css'teki ortak tokenlardan gelir). Ritim
 * kartların YÜKSEKLİĞİNDEN gelir — her kart deterministik bir "ölçek"
 * (`RHYTHM`) alır, böylece sunucu ve istemci aynı düzeni üretir (rastgelelik
 * hydration uyuşmazlığı yaratırdı).
 *
 * Masonry için CSS `columns` kullanılır: JS ölçümü olmadan, tek satır CSS ile
 * gerçek değişken yükseklik verir ve `break-inside-avoid` kartların kolon
 * arasında bölünmesini engeller. Grid tabanlı bir masonry burada satır
 * yüksekliklerinin JS ile ölçülmesini gerektirirdi.
 */

// Kart ölçek ritmi: index % 5 → tipografi ölçeği. 0 ve 3 "büyük" kartlar,
// bunlardan ilki ayrıca bir atmosfer görseli taşır.
const RHYTHM = ['xl', 'sm', 'md', 'lg', 'sm'] as const

const QUOTE_SIZE: Record<(typeof RHYTHM)[number], string> = {
  sm: 'text-lg leading-snug',
  md: 'text-xl leading-snug',
  lg: 'text-2xl leading-snug',
  xl: 'text-2xl leading-snug md:text-3xl',
}

/**
 * GERÇEK GÖRSELLER: bunlar mekân/atmosfer fotoğraflarıdır, bir üyenin
 * katıldığı etkinliğin kaydı DEĞİLDİR (sitenin henüz gerçekleşmiş etkinliği
 * yok). Bu yüzden `alt` metinleri mekânı anlatır, "etkinlikten bir an" demez.
 */
const ATMOSPHERE: { src: string; alt: Localized }[] = [
  {
    src: '/img/venue/bahce.webp',
    alt: { tr: 'Zeytinliğe açılan otel bahçesi', en: 'The hotel garden opening onto the olive grove' },
  },
  {
    src: '/img/venue/balkon.webp',
    alt: { tr: 'Denize bakan taş balkon', en: 'Stone balcony looking out to the sea' },
  },
]

/** İlk açılışta gösterilen kart sayısı — gerisi "Daha Fazla Deneyim Gör" ile gelir. */
const INITIAL_COUNT = 4

export function CommunityWall({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.community')
  const tTestimonials = useTranslations('home.testimonials')
  const tEvents = useTranslations('events')
  const [expanded, setExpanded] = useState(false)

  const items = getTestimonials()
  if (items.length === 0) return null

  const visible = expanded ? items : items.slice(0, INITIAL_COUNT)
  const hasMore = items.length > INITIAL_COUNT

  return (
    <Section background="surface">
      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title max-w-3xl">{t('title')}</h2>
      </BlurFade>

      {/* Yalnızca geliştirmede görünür uyarı — mevcut anahtar yeniden kullanılır. */}
      {process.env.NODE_ENV !== 'production' && items.some((i) => i.isPlaceholder) && (
        <p
          className="mt-6 max-w-2xl rounded-[var(--radius-card)] bg-sand/40 p-4 text-sm font-medium text-text"
          data-testid="testimonials-dev-warning"
        >
          {tTestimonials('devWarning')}
        </p>
      )}

      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-6" data-testid="community-wall">
        {visible.map((item, index) => {
          const scale = RHYTHM[index % RHYTHM.length]
          const isBig = scale === 'xl' || scale === 'lg'
          // Atmosfer görseli yalnızca ilk ritim döngüsündeki iki büyük kartta:
          // görsel bir aksan olmalı, tekrar eden bir desen değil.
          const atmosphere = index === 0 ? ATMOSPHERE[0] : index === 3 ? ATMOSPHERE[1] : undefined
          const camp = item.campSlug ? getCampBySlug(item.campSlug) : undefined

          return (
            <BlurFade
              className="mb-5 break-inside-avoid lg:mb-6"
              delay={0.04 * (index % INITIAL_COUNT)}
              key={item.id}
              offset={14}
            >
              <figure
                className={cn(
                  // Yumuşak kart yüzeyi. `overflow-hidden` atmosfer görselinin
                  // yuvarlatılmış üst köşelerden taşmasını engeller.
                  'flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand/70',
                  'shadow-[var(--shadow-card)] transition-all duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]',
                  // Dolu/boş dönüşümü duvara ritim verir: her üçüncü kart krem
                  // zeminden ayrışır.
                  index % 3 === 1 ? 'bg-background' : 'bg-surface',
                )}
              >
                {atmosphere && (
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <Image
                      alt={atmosphere.alt[locale]}
                      className="object-cover"
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={atmosphere.src}
                    />
                  </div>
                )}

                <div className={cn('flex flex-col gap-5 p-6', isBig && 'md:p-8')}>
                  {item.isPlaceholder && (
                    // Görünür ÖRNEK işareti: kart gerçek bir müşteri yorumu
                    // olmadığı sürece bu rozet KALDIRILMAMALIDIR.
                    <span
                      className="self-start rounded-full border border-olive px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-olive uppercase"
                      data-testid="community-card-placeholder-badge"
                    >
                      {tEvents('placeholderBadge')}
                    </span>
                  )}

                  <blockquote className={cn('font-heading font-medium text-text', QUOTE_SIZE[scale])}>
                    “{item.quote[locale]}”
                  </blockquote>

                  <figcaption className="mt-auto border-t border-sand pt-4 text-xs tracking-[0.14em] text-muted uppercase">
                    {item.author}
                    {camp && (
                      <span className="mt-1 block normal-case tracking-normal text-olive">{camp.title[locale]}</span>
                    )}
                  </figcaption>
                </div>
              </figure>
            </BlurFade>
          )
        })}
      </div>

      {hasMore && !expanded && (
        <div className="mt-10 flex justify-center">
          <Button data-testid="community-wall-more" onClick={() => setExpanded(true)} variant="ghost">
            {t('more')}
          </Button>
        </div>
      )}
    </Section>
  )
}
