'use client'

import { motion } from 'motion/react'
import { Children, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

const DURATION = 0.7
const EASE = [0.16, 1, 0.3, 1] as const
const DEFAULT_STAGGER = 0.08

type RevealProps = {
  children: ReactNode
  /** Animasyon başlamadan önceki gecikme (saniye). */
  delay?: number
  /** Başlangıçtaki dikey kayma miktarı (px). */
  y?: number
  className?: string
}

/**
 * Bir öğeyi görünüme girdiğinde yukarı kayarak ve belirerek açar. Yalnızca
 * `opacity` ve `transform` animasyonu kullanır; bir kez tetiklenir.
 *
 * Hareket azaltma istendiğinde animasyon hiç kurulmaz — içerik doğrudan son
 * hâliyle (opacity 1, transform yok) render edilir.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupProps = {
  children: ReactNode
  /** Çocuklar arası gecikme (saniye). */
  stagger?: number
  className?: string
}

/**
 * Doğrudan çocuklarını (her biri bir `motion.div`'e sarılarak) sırayla
 * açan grup. `Reveal` ile aynı görsel dile sahiptir ama zamanlamayı
 * `staggerChildren` ile merkezîleştirir.
 */
export function RevealGroup({ children, stagger = DEFAULT_STAGGER, className }: RevealGroupProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
