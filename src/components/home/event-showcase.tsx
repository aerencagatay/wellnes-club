import { useTranslations } from 'next-intl'
import { getUpcomingEvents } from '@/content'
import { EventCard } from '@/components/events/event-card'
import { DrawIn } from '@/components/art/draw-in'
import { HandUnderline } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'

/**
 * Hero'nun hemen altındaki yatay etkinlik rail'i.
 *
 * TAMAMEN JS'SİZ ÇALIŞIR — bilinçli bir karar. Yatay gezinme için gereken her
 * şeyi (dokunmatik kaydırma, klavye/scrollbar, kart hizalama) tarayıcının
 * kendisi `overflow-x` + `scroll-snap` ile veriyor; ok düğmeleri bunun üzerine
 * yalnızca ikinci bir yol eklerdi. Bu sayede bileşen bir sunucu bileşeni olarak
 * kalıyor: `events.ts` (ve dolaylı olarak `camps.ts`) verisinin tamamı istemci
 * paketine hiç girmiyor.
 *
 * Rail `container-page`in İÇİNDE durur, viewport'a taşmaz. Tam-taşma (full
 * bleed) için negatif `margin-inline` gerekirdi; `container-page` 1440px'te
 * ortalandığı için bu, geniş ekranlarda kartların başlıkla hizasını bozardı ve
 * `body { overflow-x: hidden }` ile birlikte fark edilmesi zor bir yatay taşma
 * riski taşırdı.
 */
export function EventShowcase({ locale, today }: { locale: AppLocale; today: string }) {
  const t = useTranslations('home.showcase')
  const events = getUpcomingEvents(today)

  // Yaklaşan etkinlik yoksa bölüm hiç render edilmez — boş bir başlık ve
  // altında boşluk bırakmaktansa sayfadan tamamen çıkar.
  if (events.length === 0) return null

  return (
    <Section background="background" className="grain">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <BlurFade offset={12}>
          <Eyebrow className="text-olive">{t('eyebrow')}</Eyebrow>
          <h2 className="type-title mt-4">{t('title')}</h2>
          {/* Marker altı çizgisi — posterin anotasyon dili. */}
          <DrawIn className="ink-sun mt-3 max-w-xs" duration={0.9}>
            <HandUnderline className="h-2.5" />
          </DrawIn>
        </BlurFade>
        <BlurFade delay={0.1} offset={12}>
          <Link
            className="group inline-flex items-center gap-2 border-b-2 border-text pb-1 text-xs font-semibold tracking-[0.14em] text-text uppercase transition-colors duration-200 hover:text-orange-deep hover:border-orange-deep"
            href="/kamplar"
          >
            {t('all')}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </BlurFade>
      </div>

      <BlurFade delay={0.15} offset={20}>
        {/* `pb-6` kaydırma çubuğunun kartlara değmemesi için; `-mb-6` bunu geri
            alarak bölümün alt ritmini bozmaz. İnce kum renkli scrollbar,
            desktop'ta "burası yatay kayıyor" ipucunu JS'siz verir. */}
        <ul className="-mb-6 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-color:var(--color-olive)_transparent] [scrollbar-width:thin]">
          {events.map((event) => (
            <li
              className={cn(
                'shrink-0 snap-start',
                // Gerçek etkinlik kartı ölçüyle de öne çıkar: örneklerden daha
                // geniş durur, böylece hiyerarşi renkten bağımsız okunur.
                event.isPlaceholder
                  ? 'w-[78vw] max-w-[340px] sm:w-[300px] lg:w-[340px]'
                  : 'w-[85vw] max-w-[420px] sm:w-[360px] lg:w-[420px]',
              )}
              key={event.id}
            >
              <EventCard event={event} locale={locale} />
            </li>
          ))}
        </ul>
      </BlurFade>

      <p className="type-hand-sm mt-8">{t('scrollHint')}</p>
    </Section>
  )
}
