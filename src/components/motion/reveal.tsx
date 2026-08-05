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

  // Not: Grubu tek bir üst `motion` düğümüyle (variants + staggerChildren) izlemek
  // yerine her çocuk kendi `whileInView`'ını gecikmeli olarak tetikler. Bunun nedeni
  // görsel değil, teknik: `itemAs="li"` ile çağıran taraf sarmalayıcıya genellikle
  // `display: contents` uygular (bkz. daily-flow.tsx — `ol > div > li` geçersiz
  // işaretleme olurdu). `display: contents` olan bir düğümün kendi kutusu/geometrisi
  // YOKTUR; üstteki `motion.div`'i IntersectionObserver ile izlemek sıfır boyutlu bir
  // dikdörtgeni izlemek anlamına gelir ve `isIntersecting` asla `true` olmaz — bu,
  // gerçek tarayıcıda doğrulanmış bir davranıştır (manuel bir IntersectionObserver
  // aynı düğümde `{top:0,bottom:0,left:0,right:0}` rapor eder). Sonuç: öğeler kalıcı
  // olarak `opacity: 0` kalırdı. Her çocuğu kendi (gerçek geometrisi olan) düğümü
  // üzerinden izlemek bu ölü bölgeyi tamamen ortadan kaldırır ve ayrıca yatay bir
  // zaman çizelgesinde öğeler farklı anlarda görünüme girdiğinde (kaydırma ile) daha
  // doğru bir davranış sağlar.
  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <MotionItem
          className={itemClassName}
          initial={{ opacity: 0, y: 24 }}
          key={index}
          transition={{ delay: index * stagger, duration: DURATION, ease: EASE }}
          viewport={{ once: true, margin: '-10% 0px' }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {child}
        </MotionItem>
      ))}
    </div>
  )
}
