'use client'

import { motion, useScroll, useSpring } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * Sayfanın en üstünde, navbar'ın hemen altında duran ince ilerleme rayı.
 *
 * Bir "okuma yüzdesi" göstergesi DEĞİL — sergideki konumun işareti. Bu yüzden
 * yüzde metni yok, sayı yok; yalnızca dolan bir çizgi.
 *
 * `scaleX` KULLANILIR, `width` DEĞİL: `width` her karede layout'u yeniden
 * hesaplatır (reflow) ve uzun sayfalarda kaydırma sırasında gözle görülür
 * takılma üretir. `transform: scaleX()` yalnızca compositor'da çalışır ve ana
 * iş parçacığına hiç dokunmaz.
 *
 * `transform-origin: left` şart: varsayılan merkez olduğu için çizgi ortadan
 * iki yana açılırdı.
 *
 * HAREKET AZALTMA: ray tamamen kaldırılır. Sürekli hareket eden, bilgi
 * taşımayan bir öğe tam olarak bu tercihin dışladığı şeydir — ve kaydırma
 * konumu zaten tarayıcının kendi çubuğunda var.
 */
export function ScrollRail() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-olive"
      style={{ scaleX }}
    />
  )
}
