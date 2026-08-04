'use client'

import { motion } from 'motion/react'
import { Children, createElement, useMemo, type ReactNode } from 'react'
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

type IntrinsicTag = keyof React.JSX.IntrinsicElements

type RevealGroupProps = {
  children: ReactNode
  /** Çocuklar arası gecikme (saniye). */
  stagger?: number
  /** Grup sarmalayıcısına uygulanan sınıf. */
  className?: string
  /**
   * Her çocuğu saran öğe; varsayılan `div`. Liste düzenleri için `li` verin
   * (ör. Daily Flow zaman çizelgesi bir `<ul>` içinde anlamsal `<li>` öğeleri
   * gerektirir — `div` `ul` içinde geçersiz işaretleme olur).
   */
  itemAs?: IntrinsicTag
  /**
   * Her çocuk sarmalayıcısına uygulanan sınıf (ör. flex/grid item sınıfları).
   * Sarmalayıcı, ebeveynin doğrudan çocuğu olduğu için düzen sınıfları
   * `className` yerine buraya verilmelidir.
   */
  itemClassName?: string
}

/**
 * Doğrudan çocuklarını (her biri `itemAs` ile belirtilen bir öğeye
 * sarılarak) sırayla açan grup. `Reveal` ile aynı görsel dile sahiptir ama
 * zamanlamayı `staggerChildren` ile merkezîleştirir.
 *
 * Hareket azaltma istendiğinde de her çocuk aynı `itemAs`/`itemClassName`
 * ile sarılır — yalnızca animasyon kaldırılır — böylece ebeveynin flex/grid
 * düzeni her iki durumda da aynı DOM şekline güvenebilir.
 */
export function RevealGroup({
  children,
  stagger = DEFAULT_STAGGER,
  className,
  itemAs = 'div',
  itemClassName,
}: RevealGroupProps) {
  const reduced = useReducedMotion()
  // `motion.create` bilinen bir HTML etiketinden (dize) veya bir bileşenden
  // resmi olarak desteklenen, tipli bir `motion` bileşeni üretir. Her
  // render'da yeniden oluşturmamak için `itemAs` değişmediği sürece
  // hafızada tutulur (aksi hâlde her render'da yeni bir bileşen kimliği
  // React'in çocukları yeniden bağlamasına yol açardı).
  const MotionItem = useMemo(() => motion.create(itemAs), [itemAs])

  if (reduced) {
    return (
      <div className={className}>
        {Children.toArray(children).map((child, index) =>
          createElement(itemAs, { key: index, className: itemClassName }, child)
        )}
      </div>
    )
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
        <MotionItem
          key={index}
          className={itemClassName}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
          }}
        >
          {child}
        </MotionItem>
      ))}
    </motion.div>
  )
}
