'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

type MarqueeProps = {
  items: string[]
  /** Bir tam turun kaç saniye süreceği. */
  speed?: number
}

/**
 * Sonsuz, sakin bir yatay metin şeridi. Tamamen dekoratif — ekran
 * okuyucudan gizlenir (`aria-hidden`). Kararlı bir his için hover'da
 * durmaz.
 *
 * Hareket azaltma istendiğinde döngü hiç kurulmaz; içerik tek, sabit bir
 * satır olarak görünür kalır.
 */
export function Marquee({ items, speed = 40 }: MarqueeProps) {
  const reduced = useReducedMotion()
  const content = items.join(' · ')

  if (reduced) {
    return (
      <div aria-hidden className="overflow-hidden whitespace-nowrap">
        <span>{content}</span>
      </div>
    )
  }

  return (
    <div aria-hidden className="overflow-hidden">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <span className="pr-8">{content}</span>
        <span className="pr-8">{content}</span>
      </motion.div>
    </div>
  )
}
