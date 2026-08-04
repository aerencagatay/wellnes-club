'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

type ParallaxProps = {
  children: ReactNode
  /** Maksimum dikey kayma miktarı (px), abartılmamalı. */
  amount?: number
  className?: string
}

/**
 * Hafif bir katman hissi: içerik, görünüm içinden geçerken küçük bir dikey
 * kayma yapar. Yalnızca `transform` (translateY) kullanır.
 *
 * Hareket azaltma istendiğinde kayma uygulanmaz; içerik sabit konumda
 * görünür.
 */
export function Parallax({ children, amount = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount])

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
