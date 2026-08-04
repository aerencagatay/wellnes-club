'use client'

import { motion } from 'motion/react'
import type { ElementType } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

const LINE_DELAY = 0.09
const DURATION = 0.7
const EASE = [0.16, 1, 0.3, 1] as const

type MaskedLinesProps = {
  lines: string[]
  /** Her satırı saran öğe; varsayılan `div`. */
  as?: ElementType
  className?: string
}

/**
 * Hero'nun imza on-load anı: her satır kendi `overflow: hidden` maskesi
 * içinde `translateY(100%)`'den `0`'a kayarak sırayla açılır.
 *
 * Hareket azaltma istendiğinde satırlar animasyonsuz, doğrudan son
 * konumlarında (transform yok) render edilir.
 */
export function MaskedLines({ lines, as: Wrapper = 'div', className }: MaskedLinesProps) {
  const reduced = useReducedMotion()

  return (
    <Wrapper className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block will-change-transform"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{
                duration: DURATION,
                delay: index * LINE_DELAY,
                ease: EASE,
              }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Wrapper>
  )
}
