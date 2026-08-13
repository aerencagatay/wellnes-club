'use client'

import { ArrowRight, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import type { WellnessEvent } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { BlurFade } from '@/components/motion/blur-fade'
import { BorderBeam } from '@/components/motion/border-beam'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils/cn'
import { formatEventDate, formatEventPrice, getReservationHref } from '@/lib/utils/event-display'
import { ScheduleModal } from './schedule-modal'

type Props = {
  event: WellnessEvent
  locale: AppLocale
  /** Listedeki sıra — medya yerleşiminin dönüşümlü ritmini belirler. */
  index: number
  /** Yalnızca ilk satır için `true`: LCP görselini erken yükler. */
  priority?: boolean
}

/**
 * /kamplar sayfasının editoryal "feature satırı": desktop'ta iki eşit sütun
 * (bilgi + büyük görsel), mobilde tek sütun istif.
 *
 * MEDYA RİTMİ: yerleşim `index`'in tekliğine göre dönüşümlüdür — çift
 * satırlarda görsel sağda, tek satırlarda solda. Bu yalnızca DESKTOP'ta
 * (`lg:order-*`) uygulanır; mobilde sıra her zaman "görsel → metin" kalır,
 * çünkü küçük ekranda dönüşümlü sıra okuma akışını rastgele hissettirir.
 * DOM sırası her satırda aynı (önce medya, sonra metin) olduğu için görsel
 * dönüşüm klavye/ekran okuyucu sırasını hiç değiştirmez.
 *
 * ÖRNEK (`isPlaceholder`) kayıtlarda tarih/fiyat yerine "yakında" metinleri,
 * görünür bir ÖRNEK rozeti ve PASİF bir rezervasyon düğmesi render edilir —
 * bkz. content/types.ts'teki `isPlaceholder` notu.
 */
export function EventRow({ event, locale, index, priority = false }: Props) {
  const t = useTranslations('events')
  const tCategory = useTranslations('eventCategory')
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const title = event.title[locale]
  const reservationHref = getReservationHref(event)
  const price = formatEventPrice(event, locale, t('priceTba'))
  const mediaOnRight = index % 2 === 0

  return (
    <BlurFade as="li" offset={28}>
      <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div
          className={cn(
            // Görsel çerçevesi: medya yarıçapı + yumuşak gölge. `overflow-hidden`
            // görselin yuvarlatılmış köşenin dışına taşmasını engeller.
            'relative aspect-[4/3] w-full overflow-hidden bg-surface lg:aspect-[5/4]',
            'rounded-[var(--radius-media)] shadow-[var(--shadow-card)] transition-all duration-300 ease-out',
            mediaOnRight ? 'lg:order-2' : 'lg:order-1',
          )}
        >
          {event.media.type === 'video' && event.media.poster ? (
            // Videoda otomatik oynatma yok: kullanıcı başlatana kadar poster
            // görünür. Sonsuz döngüyle oynayan bir arka plan videosu hareket
            // azaltma isteğiyle bağdaşmıyor ve liste sayfasında beş satır
            // birden ağır yük oluşturuyor.
            <video
              className="size-full object-cover"
              controls
              poster={event.media.poster}
              preload="none"
              src={event.media.src}
            />
          ) : (
            <Image
              alt={event.media.alt[locale]}
              className="object-cover"
              fill
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={event.media.src}
            />
          )}
          {/* Kenar hüzmesi yalnızca GERÇEK etkinlikte: hareket burada
              "gerçekten katılabileceğin şey bu" anlamını taşır. */}
          {!event.isPlaceholder && <BorderBeam duration={10} />}
        </div>

        <div className={cn('min-w-0', mediaOnRight ? 'lg:order-1' : 'lg:order-2')}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Eyebrow>{tCategory(event.category)}</Eyebrow>
            {event.isPlaceholder && <Badge tone="neutral">{t('placeholderBadge')}</Badge>}
          </div>

          <h2 className="type-title mt-4 text-balance">{title}</h2>

          {/* Tarih ve konum düz metin olarak veriliyor: bir `<dl>` burada
              görünür etiket (`<dt>`) taşımayacağı için yalnızca uydurma
              sr-only başlıklar eklerdi — sözlük yapısı olmadan da satır
              kendi kendini açıklıyor. */}
          <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span>{formatEventDate(event, locale, t('dateTba'))}</span>
            <span className="flex items-center gap-2">
              <MapPin aria-hidden className="size-4 shrink-0 text-taupe" />
              {event.location[locale]}
            </span>
          </p>

          <p className="type-lede mt-6 max-w-prose">{event.shortDescription[locale]}</p>

          {event.isPlaceholder ? (
            <p className="mt-6 max-w-prose border-l-2 border-sand pl-5 text-sm leading-relaxed text-muted">
              {t('placeholderNote')}
            </p>
          ) : (
            <p className="mt-6 font-heading text-2xl font-medium text-text">
              {price} <span className="type-eyebrow align-middle">{t('perPerson')}</span>
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* `getReservationHref` ÖRNEK kayıtlarda `undefined` döner; bu
                durumda gerçek bir bağlantı DEĞİL, pasif bir düğme render
                edilir — var olmayan bir etkinliğe rezervasyon formu açmak
                gerçek müşteriyi yanıltır. */}
            {reservationHref ? (
              <Button href={reservationHref} shimmer size="lg" variant="primary">
                {t('reserve')} <ArrowRight aria-hidden className="size-4" /> {price}
              </Button>
            ) : (
              <Button disabled size="lg" variant="primary">
                {t('reserveDisabled')}
              </Button>
            )}

            <Button onClick={() => setScheduleOpen(true)} size="lg" variant="ghost">
              {t('viewProgram')}
            </Button>
          </div>
        </div>
      </article>

      <ScheduleModal
        eventTitle={title}
        locale={locale}
        onClose={() => setScheduleOpen(false)}
        open={scheduleOpen}
        schedule={event.schedule}
      />
    </BlurFade>
  )
}
