'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, type RefObject } from 'react'
import { useLenis } from '@/components/motion/smooth-scroll'

export type LightboxImage = { src: string; alt: string }

/**
 * Fullscreen galeri diyaloğu. Odak tuzağı deseni `navbar.tsx`'in mobil
 * menüsünden birebir alınmıştır (role="dialog", aria-modal, açılışta odak
 * gerçek bir öğeye taşınır, Escape kapatır, Tab panelde döner, kapanışta
 * odak tetikleyiciye döner) — burada FARK olarak iki ayrı `useEffect`
 * kullanılır: biri açık/kapalı YAŞAM DÖNGÜSÜ için (scroll kilidi + lenis
 * durdurma + ilk odak + kapanışta tetikleyiciye dönüş), diğeri KLAVYE
 * dinleyicisi için. Navbar'da tek efekt yeterliydi çünkü orada "açık" tek
 * bir boole durumdu; burada ok tuşlarıyla `index` sık sık değişir — ikisini
 * aynı efektte tutmak her ok tuşu basışında scroll kilidini/lenis'i
 * durdurup yeniden başlatır ve odağı gereksiz yere kapatma düğmesine geri
 * taşırdı. Yaşam döngüsü efekti yalnızca `open` (boole) değiştiğinde
 * çalışır; klavye efekti `index` değiştiğinde yeniden bağlanır ama
 * scroll/odak durumuna dokunmaz.
 */
export function VenueLightbox({
  images,
  index,
  onClose,
  onNavigate,
  triggerRef,
  ariaLabel,
  closeLabel,
  prevLabel,
  nextLabel,
  counterLabel,
}: {
  images: LightboxImage[]
  /** `null` → kapalı. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
  /** Kapanışta odağın geri döneceği öğe — tetikleyen küçük fotoğrafı açan taraf ayarlar. */
  triggerRef: RefObject<HTMLElement | null>
  ariaLabel: string
  closeLabel: string
  prevLabel: string
  nextLabel: string
  /** `(current, total) => "2 / 7"` gibi bir metin üretir. */
  counterLabel: (current: number, total: number) => string
}) {
  const open = index !== null
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()

  // Yaşam döngüsü: scroll kilidi + lenis durdurma + ilk odak + kapanışta
  // tetikleyiciye dönüş. Bkz. smooth-scroll.tsx → useLenis: `body.overflow`
  // tek başına lenis'in kendi `raf` döngüsünü durdurmaz, bu yüzden ikisi
  // birlikte uygulanır.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    lenis.stop()
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      lenis.start()
      triggerRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Klavye: Escape kapatır, ok tuşları gezinir, Tab panelde döner.
  useEffect(() => {
    if (!open || index === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (images.length > 1 && event.key === 'ArrowRight') {
        onNavigate((index + 1) % images.length)
        return
      }
      if (images.length > 1 && event.key === 'ArrowLeft') {
        onNavigate((index - 1 + images.length) % images.length)
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, index, images.length, onClose, onNavigate])

  if (index === null) return null
  const current = images[index]

  return (
    <div
      aria-label={ariaLabel}
      aria-modal="true"
      className="fixed inset-0 z-60 flex items-center justify-center bg-dark/95 backdrop-blur-sm"
      data-testid="venue-lightbox"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      ref={panelRef}
      role="dialog"
    >
      <button
        aria-label={closeLabel}
        className="absolute top-5 right-5 z-10 p-2 text-background hover:bg-background/10 md:top-8 md:right-8"
        data-testid="venue-lightbox-close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        <X className="size-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            aria-label={prevLabel}
            className="absolute left-2 z-10 p-2 text-background hover:bg-background/10 md:left-6"
            data-testid="venue-lightbox-prev"
            onClick={() => onNavigate((index - 1 + images.length) % images.length)}
            type="button"
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            aria-label={nextLabel}
            className="absolute right-2 z-10 p-2 text-background hover:bg-background/10 md:right-6"
            data-testid="venue-lightbox-next"
            onClick={() => onNavigate((index + 1) % images.length)}
            type="button"
          >
            <ChevronRight className="size-8" />
          </button>
        </>
      )}

      <div className="relative h-[75vh] w-full max-w-5xl px-4" onClick={(event) => event.stopPropagation()}>
        <Image
          alt={current.alt}
          className="object-contain"
          fill
          sizes="100vw"
          src={current.src}
        />
      </div>

      {/* text-background: koyu (`bg-dark/95`) zemin üzerinde krem metin, brief §2'ye göre izinli. */}
      <p className="absolute inset-x-0 bottom-6 text-center text-xs tracking-widest text-background/70 uppercase">
        {counterLabel(index + 1, images.length)}
      </p>
    </div>
  )
}
