'use client'

import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

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

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
