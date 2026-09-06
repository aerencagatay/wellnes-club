'use client'

import { useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'

/**
 * =============================================================================
 * ÇİZİLEN İŞARET — SKETCH'LER KENDİLERİNİ ÇİZER
 * =============================================================================
 * Sarmaladığı SVG'nin çizgileri, öğe görünüme girdiğinde bir kalem gibi
 * soldan sağa çizilir.
 *
 * NEDEN BU HAREKET, NEDEN BİR "FADE" DEĞİL: bunlar el çizimi işaretler. Bir
 * çizimin var oluş biçimi belirmek değil, ÇİZİLMEKTİR. Solarak gelen bir
 * doodle bir görsel dosyası gibi davranır; çizilerek gelen bir doodle biri
 * onu az önce çizmiş gibi durur. Sitenin bütün "sketch" iddiası bu farkta.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NASIL ÇALIŞIYOR — `pathLength` HİLESİ
 *
 * Bir SVG yoluna `pathLength="1"` verildiğinde tarayıcı o yolun gerçek
 * uzunluğunu 1 birim sayar. Böylece `stroke-dasharray: 1` tek bir kesik
 * çizgi, `stroke-dashoffset: 1` ise onu tamamen görünmez yapar; offset 0'a
 * gittiğinde çizgi baştan sona ortaya çıkar.
 *
 * Bu, yolun GERÇEK uzunluğunu JS ile ölçmeye (`getTotalLength()`) gerek
 * bırakmaz — ki o ölçüm her işaret için bir layout okuması demekti ve
 * sunucuda hiç mümkün değildi.
 *
 * ÖNEMLİ: sarmalanan SVG'nin yollarında `pathLength={1}` BULUNMALIDIR.
 * `marks.tsx`'teki işaretler bunu taşıyor. Taşımayan bir SVG sarmalanırsa
 * çizim animasyonu ÇALIŞMAZ ama görsel de bozulmaz — sessizce durağan kalır.
 *
 * HAREKET AZALTMA: animasyon hiç kurulmaz, çizgiler tam görünür başlar.
 * `stroke-dashoffset` bir GEÇİŞ değil bir BAŞLANGIÇ DURUMU olduğu için
 * globals.css'teki süre kısaltma kuralı burada yetmez — çizimler kalıcı
 * olarak yarım kalırdı (aynı tuzak `BlurFade`teki `blur()` için de geçerli).
 */
export function DrawIn({
  children,
  className = '',
  /** Çizim süresi (sn). Uzun yollarda artırın. */
  duration = 1.1,
  /** Başlamadan önceki gecikme (sn) — sıralı çizim için. */
  delay = 0,
  /** Her görünüme girişte yeniden çizsin mi? Varsayılan: yalnızca ilk kez. */
  repeat = false,
}: {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  repeat?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: !repeat, margin: '-60px' })

  const active = reduced || inView

  return (
    <span
      className={cn('block', className)}
      ref={ref}
      style={
        reduced
          ? undefined
          : ({
              ['--draw-duration' as string]: `${duration}s`,
              ['--draw-delay' as string]: `${delay}s`,
            } as React.CSSProperties)
      }
      data-drawn={active ? 'true' : 'false'}
    >
      {children}
    </span>
  )
}
