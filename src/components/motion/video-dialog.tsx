'use client'

import { Play, X } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from '@/components/motion/smooth-scroll'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'

/**
 * MagicUI `HeroVideoDialog` uyarlaması: poster küçük resmi + minimal oynat
 * düğmesi, tıklayınca videoyu tam ekran bir lightbox'ta açar.
 *
 * Erişilebilirlik deseni `navbar.tsx`'in mobil paneli ve `venue-lightbox.tsx`
 * ile BİREBİR aynıdır (role="dialog" + aria-modal + açılışta odak gerçek bir
 * öğeye taşınır + Escape kapatır + Tab panelde döner + kapanışta odak
 * tetikleyiciye döner + body scroll kilidi). Sitede üçüncü bir modal deseni
 * icat etmemek bilinçli: aynı davranış aynı kodla gelsin.
 *
 * MagicUI'nin özgün sürümünden sapmalar:
 *   1. Giriş animasyonu `useReducedMotion` ile korunur — hareket azaltma
 *      isteğinde ölçek/opaklık geçişi hiç KURULMAZ, diyalog anında görünür.
 *   2. `<video>` yalnızca diyalog AÇIKKEN monte edilir. Bu hem katlamanın
 *      altındaki posterlerin video baytı indirmesini engeller hem de kapanışta
 *      sesin devam etmesini imkânsız kılar (kaynak sökülür).
 *   3. Lenis durdurulur: `body.overflow` tek başına lenis'in kendi raf
 *      döngüsünü durdurmuyor (bkz. smooth-scroll.tsx → useLenis).
 */

// Aynı anda birden fazla videonun oynamaması için modül kapsamında tek bir
// "açık diyalog" kaydı tutulur. Normalde iki diyalog aynı anda açılamaz (açık
// olan tam ekranı kaplar), ama bu kayıt davranışı yerleşim varsayımlarına
// bırakmaz: bir diyalog açılırken kayıtlı olan kendi `close`'unu çağırır.
const openDialogs = new Set<() => void>()

type VideoDialogProps = {
  /** Video dosya yolu. Gerçek bir dosya yoksa bu bileşen HİÇ render edilmemeli. */
  videoSrc: string
  /** Poster (küçük resim) görseli — video asla postersiz sunulmaz. */
  posterSrc: string
  posterAlt: string
  /** Oynat düğmesinin erişilebilir adı (i18n: `home.gallery.play`). */
  playLabel: string
  /** Kapat düğmesinin erişilebilir adı (i18n: `home.gallery.close`). */
  closeLabel: string
  /** Diyaloğun erişilebilir adı — verilmezse `posterAlt` kullanılır. */
  dialogLabel?: string
  /** Tetikleyici (poster) sarmalayıcısının sınıfları — en/boy oranını çağıran verir. */
  className?: string
  /** Poster için `sizes` — `fill` kullanıldığından zorunlu tutulur. */
  sizes?: string
}

export function VideoDialog({
  videoSrc,
  posterSrc,
  posterAlt,
  playLabel,
  closeLabel,
  dialogLabel,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: VideoDialogProps) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const lenis = useLenis()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Açılışta diğer tüm açık diyaloglar kapatılır → aynı anda tek video oynar.
  const openDialog = useCallback(() => {
    for (const closeOther of openDialogs) closeOther()
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    openDialogs.add(close)
    document.body.style.overflow = 'hidden'
    lenis.stop()
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return
      // `video` da odaklanabilir (controls) — tuzağın dışında kalmamalı.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), video')
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
      openDialogs.delete(close)
      document.body.style.overflow = ''
      lenis.start()
      document.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
    // `lenis` her render'da yeni bir nesne olabileceğinden bağımlılığa
    // alınmaz: efekt yalnızca açık/kapalı geçişinde çalışmalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close])

  // Hareket azaltma isteğinde geçiş süresi sıfıra iner (bkz. blur-fade.tsx:
  // sadece "hızlandırmak" yetmez, animasyon durumu hiç kurulmamalı).
  const overlayMotion = reduced
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
  const panelMotion = reduced
    ? { initial: false as const, animate: { opacity: 1, scale: 1 }, exit: { opacity: 1, scale: 1 } }
    : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } }

  return (
    <>
      <button
        aria-label={playLabel}
        className={cn(
          // Poster tetikleyicisi bir görsel çerçevesidir: medya yarıçapı +
          // yumuşak gölge, hover'da derinleşir.
          'group relative block w-full overflow-hidden rounded-[var(--radius-media)] bg-dark',
          'shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:shadow-[var(--shadow-card-hover)]',
          className,
        )}
        data-testid="video-dialog-trigger"
        onClick={openDialog}
        ref={triggerRef}
        type="button"
      >
        <Image
          alt={posterAlt}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          fill
          loading="lazy"
          sizes={sizes}
          src={posterSrc}
        />
        {/* İnce üst katman: hover'da hafifçe koyulaşır, abartı yok. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-dark/15 transition-colors duration-500 group-hover:bg-dark/30"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Dairesel oynat düğmesi — ikon kontrolleri hap/daire biçiminde. */}
          <span className="flex size-14 items-center justify-center rounded-full border border-background/70 text-background transition-all duration-300 ease-out group-hover:bg-background/15">
            <Play className="size-5 translate-x-px" />
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-dark/95 p-4 backdrop-blur-sm"
            data-testid="video-dialog"
            key="video-dialog"
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            {...overlayMotion}
          >
            <div
              aria-label={dialogLabel ?? posterAlt}
              aria-modal="true"
              className="absolute inset-0"
              // Backdrop tıklaması: yalnızca doğrudan bu katmana gelen tıklama
              // kapatır (içerideki tıklamalar `currentTarget` eşitliğinde elenir).
              onClick={(event) => {
                if (event.target === event.currentTarget) close()
              }}
              ref={panelRef}
              role="dialog"
            >
              <button
                aria-label={closeLabel}
                className="absolute top-5 right-5 z-10 rounded-full p-2 text-background transition-colors duration-300 hover:bg-background/10 md:top-8 md:right-8"
                data-testid="video-dialog-close"
                onClick={close}
                ref={closeButtonRef}
                type="button"
              >
                <X className="size-6" />
              </button>

              <motion.div
                className="absolute inset-0 m-auto flex h-fit w-full max-w-5xl px-4"
                transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                {...panelMotion}
              >
                <video
                  autoPlay
                  // Video paneli: büyük panel yarıçapı + kalkık gölge.
                  // `overflow-hidden` yerine doğrudan `rounded-*`: <video> kendi
                  // içeriğini zaten yarıçapa göre kırpar.
                  className="max-h-[80vh] w-full rounded-[var(--radius-panel)] bg-dark shadow-[var(--shadow-lift)]"
                  controls
                  playsInline
                  poster={posterSrc}
                  src={videoSrc}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
