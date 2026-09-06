'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { getCampBySlug, getTestimonials } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { HandUnderline, Squiggle } from '@/components/art/marks'
import { Tilt } from '@/components/motion/tilt'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { BlurFade } from '@/components/motion/blur-fade'
import { cn } from '@/lib/utils/cn'

/**
 * KATILIMCI DENEYİMLERİ — "EDEN Wellness Club Katılımcıları Ne Diyor?"
 *
 * Kartlar bir sosyal medya akışını (avatar + kolon + kart) TAKLİT ETMEZ; her
 * biri panoya iğnelenmiş bir KAĞIT PARÇASIDIR: not kağıdı, kartpostal,
 * etkinlik bileti, defter yaprağı. Kimliği veren şey renk değil, KAĞIDIN
 * KENDİSİ — zemin tonu, hairline çerçeve ve hafif eğiklik.
 *
 * FOTOĞRAF YOK: eski sürüm iki kartta mekân fotoğrafı taşıyordu. Zine dilinde
 * bu kartlar "yazılmış" nesneler; araya giren bir fotoğraf onları yeniden
 * ürün kartına çeviriyordu.
 *
 * RİTİM RASTGELE DEĞİL, DETERMİNİSTİK (`RHYTHM`, `TILT`): bileşen istemcide
 * çalışsa da ilk render sunucudan geliyor; `Math.random()` sunucu ve
 * istemcide farklı değer üretip hydration uyuşmazlığı yaratırdı.
 *
 * Masonry için CSS `columns` kullanılır: JS ölçümü olmadan gerçek değişken
 * yükseklik verir ve `break-inside-avoid` kartların kolon arasında
 * bölünmesini engeller.
 */

/** Kart ölçek ritmi: index % 5 → tipografi ölçeği. */
const RHYTHM = ['xl', 'sm', 'md', 'lg', 'sm'] as const

const QUOTE_SIZE: Record<(typeof RHYTHM)[number], string> = {
  sm: 'text-lg leading-snug',
  md: 'text-xl leading-snug',
  lg: 'text-2xl leading-snug',
  xl: 'text-2xl leading-snug md:text-[1.75rem]',
}

/** Kağıt parçasının panoya eğik yapıştırılmışlık açısı. */
const TILT = ['-0.9deg', '1.2deg', '-1.4deg', '0.7deg', '1.6deg', '-0.6deg']

/** Kağıt tonu dönüşümü — üç farklı kağıt: krem, beyaz, sarımsı. */
const PAPER = ['bg-background', 'bg-paper', 'bg-surface']

/** İlk açılışta gösterilen kart sayısı — gerisi "Daha Fazla" ile gelir. */
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
    <Section background="background" className="grain">
      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title mt-4 max-w-4xl text-balance">{t('title')}</h2>
        {/* Başlığın altına marker'la çekilmiş çizgi — posterin anotasyon dili. */}
        <HandUnderline className="ink-sun mt-3 h-2.5 max-w-md" />
      </BlurFade>

      {/* Yalnızca geliştirmede görünür uyarı — mevcut anahtar yeniden kullanılır. */}
      {process.env.NODE_ENV !== 'production' && items.some((i) => i.isPlaceholder) && (
        <p
          className="mt-8 max-w-2xl border border-text bg-yellow p-4 text-sm font-medium text-text"
          data-testid="testimonials-dev-warning"
        >
          {tTestimonials('devWarning')}
        </p>
      )}

      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-6" data-testid="community-wall">
        {visible.map((item, index) => {
          const scale = RHYTHM[index % RHYTHM.length]
          const isBig = scale === 'xl' || scale === 'lg'
          const camp = item.campSlug ? getCampBySlug(item.campSlug) : undefined

          return (
            <BlurFade
              className="mb-5 break-inside-avoid lg:mb-6"
              delay={0.04 * (index % INITIAL_COUNT)}
              key={item.id}
              offset={14}
            >
              {/* Kağıt parçası da bir nesnedir: işaretçi yaklaştığında panodan
                  öne gelir. `mount` AÇIK — bu kartlar gerçekten "asılmış"
                  parçalar ve arkalarındaki kum tonlu paspartu, kaldırıldıkça
                  açılan boşluğu gösteriyor. */}
              <Tilt intensity={0.85}>
                <figure
                  className={cn(
                    // Kağıt parçası: keskin köşe, siyah hairline, gölge YOK.
                    // Hover'da parça doğrulur — panodan alınıp okunuyormuş gibi.
                    'flex flex-col border border-text transition-transform duration-500 ease-out hover:rotate-0',
                    PAPER[index % PAPER.length],
                    isBig && 'md:p-1',
                  )}
                  style={{ rotate: TILT[index % TILT.length] }}
                >
                  <div className={cn('flex flex-col gap-5 p-6', isBig && 'md:p-8')}>
                    {item.isPlaceholder && (
                      // Görünür ÖRNEK işareti: kart gerçek bir müşteri yorumu
                      // olmadığı sürece bu rozet KALDIRILMAMALIDIR.
                      <span
                        className="self-start bg-yellow px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-text uppercase"
                        data-testid="community-card-placeholder-badge"
                      >
                        {tEvents('placeholderBadge')}
                      </span>
                    )}

                    <blockquote className={cn('font-heading font-semibold text-text', QUOTE_SIZE[scale])}>
                      “{item.quote[locale]}”
                    </blockquote>

                    <Squiggle className="ink-sun h-2 w-12 shrink-0 opacity-80" />

                    <figcaption className="mt-auto text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      {item.author}
                      {camp && (
                        // Katılınan etkinlik EL YAZISIYLA — kağıda sonradan
                        // düşülmüş bir not gibi.
                        <span className="type-hand-sm mt-1.5 block normal-case tracking-normal">
                          {camp.title[locale]}
                        </span>
                      )}
                    </figcaption>
                  </div>
                </figure>
              </Tilt>
            </BlurFade>
          )
        })}
      </div>

      {hasMore && !expanded && (
        <div className="mt-12 flex justify-center">
          <Button data-testid="community-wall-more" onClick={() => setExpanded(true)} variant="ghost">
            {t('more')}
          </Button>
        </div>
      )}
    </Section>
  )
}
