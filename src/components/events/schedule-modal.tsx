'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { EventScheduleDay } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { useLenis } from '@/components/motion/smooth-scroll'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'
import { formatDateLong } from '@/lib/utils/dates'

type Props = {
  open: boolean
  onClose: () => void
  /** Başlıkta gösterilecek etkinlik adı (çağıran tarafça yerelleştirilmiş). */
  eventTitle: string
  schedule: EventScheduleDay[]
  locale: AppLocale
}

/** Focus trap'in "sarmalanabilir" saydığı öğeler — navbar'daki mobil panelle aynı sorgu. */
const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * "Programı İncele" modalı.
 *
 * PORTAL ZORUNLU: satırlar `BlurFade` içinde render ediliyor ve `BlurFade`
 * animasyon boyunca `filter: blur()` uygular. `filter`, sabit konumlu
 * (`position: fixed`) torunlar için yeni bir kapsayıcı blok (containing block)
 * oluşturur — modal satırın içinde kalsaydı viewport'a değil, satırın kutusuna
 * göre konumlanır ve tam ekran kaplaması bozulurdu. Bu yüzden içerik
 * `document.body`'ye taşınır.
 *
 * ÖRNEK etkinliklerin `schedule` dizisi boştur; bu durumda uydurma bir saat
 * cetveli üretmek yerine `scheduleTba` mesajı gösterilir (bkz. events.ts).
 */
export function ScheduleModal({ open, onClose, eventTitle, schedule, locale }: Props) {
  const t = useTranslations('events')
  const reduced = useReducedMotion()
  const lenis = useLenis()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Odak panele taşınır, Escape kapatır, gövde kaydırması durur, Tab panelde
  // döner; kapanışta odak tetikleyiciye geri verilir.
  //
  // Tetikleyici bir ref ile DIŞARIDAN geçilmek yerine açılış anındaki
  // `document.activeElement` yakalanır: aynı modal birden çok satırdan (ve
  // ileride başka ekranlardan) açılabildiği için, "beni kim açtıysa ona dön"
  // kuralı ref zincirlemekten hem daha kısa hem de yanlış ref geçme ihtimalini
  // ortadan kaldırıyor.
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null

    // `body.overflow: hidden` TEK BAŞINA YETMEZ — gerçek bir hataydı.
    //
    // Lenis kendi `raf` döngüsünde tekerlek/dokunma girdisini dinleyip sayfayı
    // `transform` ile kaydırıyor; bu, `overflow: hidden`'dan TAMAMEN bağımsız
    // çalışır. Modal açıkken tekerlek çevirmek paneli değil ARKADAKİ SAYFAYI
    // kaydırıyordu (kullanıcı bildirimi, 2026-09-07: "scroll sadece imleçle
    // sürükleyince çalışıyor"). `smooth-scroll.tsx` bu tuzağı zaten
    // belgelemişti; modal onu çağırmayı atlamıştı.
    //
    // İkisi birlikte gerekiyor: `stop()` sahte kaydırmayı, `overflow: hidden`
    // gerçek kaydırmayı kilitler.
    lenis.stop()
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      lenis.start()
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open, onClose, lenis])

  // Sunucu render'ında `document` yok. Bir `mounted` durumu + efekt yerine
  // doğrudan ortam kontrolü: istemcideki ilk render'da modal kapalı olduğu
  // için portal içeriği de boştur, dolayısıyla sunucu çıktısıyla arada bir
  // hidrasyon farkı oluşmaz — ve gereksiz bir ikinci render tetiklenmez.
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-stretch justify-center sm:items-center sm:p-6">
          {/* Backdrop: yalnızca opaklık geçer — hareket azaltmada süre 0'a iner,
              böylece efekt "hızlanmış" değil hiç yok olur.
              `aria-hidden` bir div: fare kullanıcısı için kapatma alanı, ama
              erişilebilirlik ağacında ikinci bir "Kapat" düğmesi olarak
              görünmez. Klavye yolu Escape ve gerçek kapatma düğmesidir. */}
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden
            className="absolute inset-0 bg-dark/70 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />

          <motion.div
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(
              'relative flex w-full flex-col overflow-hidden bg-background shadow-[var(--shadow-lift)]',
              // Mobil: tam ekran sheet. Desktop: viewport'un büyük bölümünü
              // kaplayan, kendi içinde kayan bir panel.
              'h-full sm:h-auto sm:max-h-[86vh] sm:max-w-3xl lg:max-w-5xl',
              // Mobilde sheet ekranın altına yaslandığı için yalnızca ÜST köşeler
              // yuvarlanır; sm ve üzerinde panel dört köşesinden serbest kalır.
              'rounded-t-[var(--radius-panel)] sm:rounded-[var(--radius-panel)]',
            )}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            ref={panelRef}
            role="dialog"
            transition={{ duration: reduced ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-start justify-between gap-6 border-b border-sand px-6 py-6 md:px-10">
              <div className="min-w-0">
                <span className="type-eyebrow">{t('programTitle')}</span>
                <h2 className="type-title mt-2 break-words" id={titleId}>
                  {eventTitle}
                </h2>
              </div>
              <button
                aria-label={t('close')}
                className="-mr-2 shrink-0 rounded-full p-2 text-muted transition-all duration-300 ease-out hover:bg-sand/50 hover:text-text"
                onClick={onClose}
                ref={closeButtonRef}
                type="button"
              >
                <X className="size-6" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
              <ScheduleBody baseId={titleId} locale={locale} schedule={schedule} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/**
 * Program gövdesi ayrı bir bileşen: seçili gün durumu BURADA yaşıyor ve bu
 * bileşen yalnızca modal açıkken monte ediliyor. Böylece "her açılışta ilk
 * güne dön" davranışı bir `useEffect` + `setState` sıfırlamasına gerek
 * kalmadan, doğal olarak montaj sırasında elde ediliyor.
 */
function ScheduleBody({
  schedule,
  locale,
  baseId,
}: {
  schedule: EventScheduleDay[]
  locale: AppLocale
  baseId: string
}) {
  const t = useTranslations('events')
  const [activeDay, setActiveDay] = useState(0)

  const day = schedule[activeDay]
  // ÖRNEK etkinliklerde `schedule` boştur — uydurma bir saat cetveli
  // üretilmez, "yakında" mesajı gösterilir (bkz. events.ts).
  if (!day) return <p className="type-lede max-w-prose">{t('scheduleTba')}</p>

  const hasTabs = schedule.length > 1

  return (
    <>
      {/* Tek günlük programlarda sekme şeridi anlamsızdır (tek seçenekli bir
          seçim) — gün etiketi düz başlık olarak gösterilir. Gerçek retreat
          şu an tam olarak bu durumda. */}
      {hasTabs ? (
        <div aria-label={t('programTitle')} className="flex flex-wrap gap-2" role="tablist">
          {schedule.map((entry, index) => (
            <button
              aria-controls={`${baseId}-panel`}
              aria-selected={index === activeDay}
              className={cn(
                // Gün sekmeleri buton yarıçapını paylaşır; seçili sekme ince bir
                // gölgeyle şeritten ayrılır.
                'rounded-[var(--radius-btn)] border px-5 py-3 text-xs uppercase tracking-[0.12em] transition-all duration-300 ease-out',
                index === activeDay
                  ? 'border-olive bg-olive text-background shadow-[var(--shadow-btn-subtle)]'
                  : 'border-text/20 text-muted hover:border-text/60 hover:text-text',
              )}
              id={`${baseId}-tab-${index}`}
              key={entry.day[locale]}
              onClick={() => setActiveDay(index)}
              role="tab"
              type="button"
            >
              {entry.day[locale]}
            </button>
          ))}
        </div>
      ) : (
        <h3 className="font-heading text-2xl font-medium text-text">{day.day[locale]}</h3>
      )}

      <div
        aria-labelledby={hasTabs ? `${baseId}-tab-${activeDay}` : undefined}
        className="mt-8"
        id={`${baseId}-panel`}
        role={hasTabs ? 'tabpanel' : undefined}
        // Sekmeli panel klavyeyle odaklanabilir olmalı ki içeriği uzun
        // olduğunda ok tuşlarıyla kaydırılabilsin. `-1`: Tab sırasına
        // girmez, focus trap'in düğme sorgusuna da takılmaz.
        tabIndex={hasTabs ? -1 : undefined}
      >
        {day.date && <p className="type-eyebrow">{formatDateLong(day.date, locale)}</p>}
        <ol className="mt-4">
          {day.items.map((item) => (
            <li
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 border-t border-sand py-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-8"
              key={`${item.time}-${item.title[locale]}`}
            >
              <span className="text-sm text-muted tabular-nums">{item.time}</span>
              <div className="min-w-0">
                <h4 className="font-heading text-lg font-medium text-text">{item.title[locale]}</h4>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description[locale]}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
