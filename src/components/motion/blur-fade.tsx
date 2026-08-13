'use client'

import { AnimatePresence, motion, useInView, type Variants } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

type BlurFadeProps = {
  children: ReactNode
  className?: string
  /** Animasyon başlamadan önceki gecikme (saniye). */
  delay?: number
  duration?: number
  /** Kayma miktarı (px). */
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  blur?: string
  /** Görünüme her girişte yeniden oynasın mı? Varsayılan: yalnızca ilk kez. */
  repeat?: boolean
  /** Sarmalayıcı öğe — liste içinde `li` verin. */
  as?: 'div' | 'li' | 'span' | 'section'
}

const OFFSET_AXIS = {
  up: { axis: 'y', sign: 1 },
  down: { axis: 'y', sign: -1 },
  left: { axis: 'x', sign: 1 },
  right: { axis: 'x', sign: -1 },
} as const

/**
 * MagicUI `BlurFade` — sitenin birincil bölüm açılış animasyonu. Öğe görünüme
 * girdiğinde bulanıklıktan netliğe geçerek ve hafifçe kayarak belirir.
 *
 * MagicUI'nin özgün sürümünden iki sapma var:
 *
 *   1. `useReducedMotion` ile korunur — hareket azaltma istendiğinde animasyon
 *      hiç KURULMAZ (yalnızca hızlandırılmaz): `filter: blur()` bir geçiş
 *      değil bir başlangıç durumu olduğu için, globals.css'teki
 *      `transition-duration: 0.01ms` kuralı bulanıklığı temizlemeye yetmez ve
 *      metin kalıcı olarak bulanık kalabilirdi.
 *   2. `as` desteği eklendi: `<ul>`/`<ol>` içinde `div` sarmalayıcı geçersiz
 *      işaretlemedir ve erişilebilirlik ağacında `list`/`listitem` ilişkisini
 *      bozar (bu, projede daha önce gerçek bir Lighthouse denetimi olarak
 *      yakalanmıştı).
 */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.5,
  offset = 20,
  direction = 'up',
  blur = '6px',
  repeat = false,
  as = 'div',
}: BlurFadeProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: !repeat, margin: '-50px' })

  const MotionTag = motion[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const { axis, sign } = OFFSET_AXIS[direction]
  const variants: Variants = {
    hidden: { [axis]: offset * sign, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: 'blur(0px)' },
  }

  return (
    <AnimatePresence>
      <MotionTag
        animate={inView ? 'visible' : 'hidden'}
        className={className}
        exit="hidden"
        initial="hidden"
        ref={ref as never}
        transition={{ delay: 0.04 + delay, duration, ease: [0.16, 1, 0.3, 1] }}
        variants={variants}
      >
        {children}
      </MotionTag>
    </AnimatePresence>
  )
}
