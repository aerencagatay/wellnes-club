'use client'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

type LenisControls = {
  /** Lenis'in kendi kaydırma işleyicisini durdurur (fiziksel scroll'u DEĞİL —
   *  onu ayrıca `document.body.style.overflow` ile kilitlemek çağıranın işi;
   *  bkz. venue-lightbox.tsx). Lenis kurulu değilse (hareket azaltma veya SSR)
   *  no-op'tur. */
  stop: () => void
  start: () => void
}

const NOOP_CONTROLS: LenisControls = { stop: () => {}, start: () => {} }

const LenisContext = createContext<LenisControls>(NOOP_CONTROLS)

/**
 * Bir modal/lightbox açıkken arka plan kaydırmasını gerçekten kilitlemek için
 * kullanılır. Yalnızca `body.overflow: hidden` YETMEZ: lenis kendi `raf`
 * döngüsünde tekerlek/dokunma girdisini dinleyip `transform` ile sahte bir
 * kaydırma uyguluyor — bu, `overflow: hidden`'dan tamamen bağımsız çalışır
 * (bkz. task-2 bulgusu, task-6 brief). Bu yüzden lightbox açılışında hem
 * `stop()` hem `document.body.style.overflow = 'hidden'` gerekir.
 */
export function useLenis(): LenisControls {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const [controls, setControls] = useState<LenisControls>(NOOP_CONTROLS)

  useEffect(() => {
    // Hareket azaltma isteniyorsa lenis hiç kurulmaz: tarayıcının kendi
    // anlık scroll'u korunur.
    if (reduced) return

    // `anchors: true`: lenis, `<a href="#...">` tıklamalarını (skip-link dahil)
    // kendi dinleyicisinden yakalayıp yumuşak kaydırıyor — ayrıca bir işlem
    // gerekmiyor.
    //
    // `window.scrollTo`'yu kasıtlı olarak yamalamıyoruz: lenis, wrapper=window
    // olduğunda fiziksel kaydırmayı zaten `window.scrollTo` üzerinden
    // uyguluyor (bkz. lenis kaynak kodu, `setScroll`). Doğrulandı: harici bir
    // `window.scrollTo({ top, behavior })` çağrısı (örn. `BackToTop`) yerel
    // olarak çalışıyor ve lenis, `onNativeScroll` ile durumunu buna göre
    // senkronize ediyor — geri sıçrama yok. `window.scrollTo`'yu yamalamak
    // (denendi) tam tersine bu iç mekanizmayı kırıyor: lenis'in kendi
    // uygulaması da aynı fonksiyonu çağırdığı için sonsuz yönlendirmeye yol
    // açıp fiziksel kaydırmayı tamamen durduruyor.
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true })
    lenisRef.current = lenis
    setControls({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
      setControls(NOOP_CONTROLS)
    }
  }, [reduced])

  const value = useMemo(() => controls, [controls])

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
