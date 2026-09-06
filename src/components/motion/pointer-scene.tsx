'use client'

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * İŞARETÇİ SAHNESİ — KAMERA, İZLEYİCİNİN BAKIŞINI TAKİP EDER
 * =============================================================================
 * Fare sahne içinde gezinirken katmanlar derinliklerine göre farklı miktarda
 * kayar: öndekiler çok, arkadakiler az. Bu "hareket paralaksı" — gerçek
 * dünyada başını hafifçe çeviren birinin gördüğü şey — ve beynin derinliği
 * okumak için kullandığı en güçlü ipuçlarından biri. Bir görüntü hiç
 * değişmeden, YALNIZCA bu farkla üç boyutlu okunur.
 *
 * SAHNE İÇİNDE, SAYFA GENELİNDE DEĞİL: dinleyici `window`a değil sahnenin
 * kendi düğümüne bağlanır. Sayfa genelinde bir fare takibi, ziyaretçi
 * sayfanın tamamen başka bir yerindeyken de hero'yu oynatırdı — bu, ilgiye
 * cevap veren bir sahne değil, huzursuz bir arka plan olurdu.
 *
 * HAREKET AZALTMA: takip hiç kurulmaz; katmanlar sabit konumlarında durur.
 */

type PointerContext = {
  /** -0.5 (sol/üst) → 0.5 (sağ/alt), yay ile yumuşatılmış. */
  x: MotionValue<number>
  y: MotionValue<number>
  reduced: boolean
}

const PointerCtx = createContext<PointerContext | null>(null)

export function PointerScene({
  children,
  className = '',
  /** Perspektif uzaklığı (px). Uzun lens = yumuşak derinlik. */
  perspective = 1200,
}: {
  children: ReactNode
  className?: string
  perspective?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Yumuşak ve AĞIR bir yay: kamera fareyi anında değil, gecikmeli takip eder.
  // Sert bir yay (yüksek stiffness) fareye yapışır ve etkiyi ucuz bir
  // "hover efekti" gibi gösterir; ağır yay onu kamera hareketine dönüştürür.
  const SPRING = { stiffness: 45, damping: 20, mass: 1.1 }
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const handleMove = useCallback(
    (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      rawX.set((event.clientX - rect.left) / rect.width - 0.5)
      rawY.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [rawX, rawY],
  )

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return
    // `passive: true` — işleyici hiç `preventDefault` çağırmıyor; bunu
    // tarayıcıya bildirmek, kaydırma sırasında ana iş parçacığının bu
    // dinleyiciyi beklemesini önler.
    node.addEventListener('pointermove', handleMove, { passive: true })
    // Fare sahneden çıktığında kamera merkeze döner — aksi halde sahne, fare
    // en son nereden çıktıysa o yöne dönük donmuş kalırdı.
    const reset = () => {
      rawX.set(0)
      rawY.set(0)
    }
    node.addEventListener('pointerleave', reset)
    return () => {
      node.removeEventListener('pointermove', handleMove)
      node.removeEventListener('pointerleave', reset)
    }
  }, [handleMove, rawX, rawY, reduced])

  return (
    <PointerCtx.Provider value={{ x, y, reduced }}>
      <div
        className={className}
        ref={ref}
        style={reduced ? undefined : { perspective: `${perspective}px`, transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </PointerCtx.Provider>
  )
}

/**
 * Sahne içindeki bir katman.
 *
 * `depth` katmanın izleyiciye UZAKLIĞIDIR, 0 = kamera düzlemi. Pozitif değer
 * katmanı öne alır ve daha çok kaydırır; negatif değer geriye iter ve
 * hareketi azaltır. Bu ilişki bilinçli olarak DOĞRUSAL: gerçek optik model
 * (1/z) uçlarda aşırı hızlanıp katmanları birbirinden koparıyordu.
 */
export function PointerLayer({
  children,
  className = '',
  depth = 0,
  /** Katmanın Z konumu (px) — örtüşme sırası ve perspektif ölçeği için. */
  z = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  depth?: number
  z?: number
  as?: 'div' | 'span' | 'p'
}) {
  const ctx = useContext(PointerCtx)
  const MotionTag = motion[as]

  // Kanca sırası sabit kalmalı: `ctx` yokken de aynı sayıda kanca çağrılır,
  // bu yüzden `useTransform`lar erken dönüşten ÖNCE kuruluyor. `ctx` null
  // olduğunda sabit bir motion value verilir ve dönüşüm sıfır üretir.
  const zero = useMotionValue(0)
  const translateX = useTransform(ctx?.x ?? zero, [-0.5, 0.5], [-depth, depth])
  const translateY = useTransform(ctx?.y ?? zero, [-0.5, 0.5], [-depth * 0.6, depth * 0.6])

  if (!ctx || ctx.reduced) {
    return <MotionTag className={className}>{children}</MotionTag>
  }

  return (
    <MotionTag
      className={className}
      style={{ x: translateX, y: translateY, translateZ: z, transformStyle: 'preserve-3d' }}
    >
      {children}
    </MotionTag>
  )
}
