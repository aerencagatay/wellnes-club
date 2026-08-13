'use client'

import { motion, type MotionStyle } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'

type BorderBeamProps = {
  /** Işık noktasının uzunluğu (px). */
  size?: number
  /** Bir tam turun süresi (saniye). */
  duration?: number
  delay?: number
  className?: string
  /** Hüzmenin gradyan renkleri — varsayılan sitenin kum/zeytin tonları. */
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
}

/**
 * MagicUI `BorderBeam` — bir kartın kenarında dolaşan ince ışık hüzmesi.
 * Yalnızca ana sayfadaki gerçek (rezervasyona açık) etkinlik kartında
 * kullanılır: ÖRNEK kayıtlar bu vurguyu almaz, böylece hareket "burada
 * gerçekten katılabileceğin şey bu" anlamını taşır.
 *
 * Konumlandırma için `offsetPath` kullanır — ebeveyni `position: relative`
 * ve `overflow-hidden` olmalıdır. Tamamen dekoratiftir (`aria-hidden`).
 *
 * MagicUI'nin özgün sürümünden sapma: `useReducedMotion` ile korunur ve
 * hareket azaltma istendiğinde hüzme hiç render edilmez — sonsuz döngü hâlinde
 * dönen bir ışık, globals.css'teki süre kısaltmasıyla durmaz, yalnızca
 * hızlanırdı.
 */
export function BorderBeam({
  size = 60,
  duration = 8,
  delay = 0,
  className,
  colorFrom = 'var(--color-sand)',
  colorTo = 'var(--color-olive)',
  reverse = false,
}: BorderBeamProps) {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <motion.div
        animate={{ offsetDistance: reverse ? ['100%', '0%'] : ['0%', '100%'] }}
        className={cn(
          'absolute aspect-square bg-gradient-to-l from-[var(--beam-from)] via-[var(--beam-to)] to-transparent',
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--beam-from': colorFrom,
            '--beam-to': colorTo,
          } as MotionStyle
        }
        transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay }}
      />
    </div>
  )
}
