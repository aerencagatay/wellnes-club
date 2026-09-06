'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * TILT — ÇERÇEVELİ BİR PARÇAYI ELE ALMAK
 * =============================================================================
 * İşaretçi parçanın üzerinde gezinirken parça, imlecin bulunduğu köşeye doğru
 * eğilir ve ziyaretçiye doğru bir miktar öne gelir. Duvardan bir baskıyı alıp
 * ışığa tutmak gibi.
 *
 * NEDEN GÖLGE YOK, "MOUNT" VAR: sistem gölgesiz (bkz. globals.css). Parçanın
 * kağıttan ayrıldığını göstermek için CSS gölgesi yerine GERÇEK BİR İKİNCİ
 * DÜZLEM kullanılıyor — parçanın arkasında, negatif Z'de duran, kum tonunda bir
 * paspartu. Bu bir efekt taklidi değil: çerçeveli bir baskının arkasındaki
 * montaj kartonunun tam olarak yaptığı şey. Parça öne geldikçe paspartu
 * perspektif gereği geride kalır ve aradaki boşluk kendiliğinden açılır.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN `pointermove` VE `mousemove` DEĞİL: `pointer` olayları fare, kalem ve
 * dokunmayı tek bir arayüzde toplar. Dokunmatikte eğim İSTENMEZ (parmak zaten
 * parçanın üstünde, eğim yalnızca titreşim olarak görünür) — bu yüzden
 * `event.pointerType` ile yalnızca 'mouse' ve 'pen' kabul edilir.
 *
 * HAREKET AZALTMA: eğim tamamen kapanır. 3B dönüşüm vestibüler rahatsızlığın
 * güçlü bir tetikleyicisidir; süreyi kısaltmak yeterli uyum değildir.
 */

/** Maksimum eğim (derece). 8° sinirli, 4° fark edilmez; 6 aradaki denge. */
const MAX_TILT = 6

/** Hover'da parçanın öne geldiği mesafe (px, Z ekseni). */
const LIFT_Z = 34

export function Tilt({
  children,
  className = '',
  /** Arkada duran paspartu düzlemini çizer. Şeffaf zeminli yuvalarda kapatın. */
  mount = true,
  /** Eğim şiddeti çarpanı — büyük parçalarda 0.7, küçüklerde 1.2 iyi durur. */
  intensity = 1,
}: {
  children: ReactNode
  className?: string
  mount?: boolean
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Ham -0.5..0.5 aralığında işaretçi konumu; yaylar bunu yumuşatır.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const lift = useMotionValue(0)

  const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)
  const sLift = useSpring(lift, { stiffness: 180, damping: 24 })

  // Y ekseni dönüşü YATAY işaretçi konumundan, X ekseni dönüşü DİKEY
  // konumdan gelir — ve X'in işareti terstir: imleç yukarıdayken parçanın
  // ÜST kenarı geri gitmeli ki yüzey imlece dönsün.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT * intensity, MAX_TILT * intensity])
  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT * intensity, -MAX_TILT * intensity])
  const translateZ = useTransform(sLift, [0, 1], [0, LIFT_Z])

  // Paspartu, parça öne geldikçe biraz daha görünür olur: aradaki boşluğun
  // açıldığını gösteren ikinci ipucu (hareket + ton, tek başına ikisi de zayıf).
  const mountOpacity = useTransform(sLift, [0, 1], [0, 0.9])

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') return
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      px.set((event.clientX - rect.left) / rect.width - 0.5)
      py.set((event.clientY - rect.top) / rect.height - 0.5)
      lift.set(1)
    },
    [lift, px, py],
  )

  const handleLeave = useCallback(() => {
    // Üçü birden sıfırlanır: yalnızca `lift`i sıfırlamak parçayı eğik
    // bırakırdı ve duvarda yamuk asılı bir baskı gibi görünürdü.
    px.set(0)
    py.set(0)
    lift.set(0)
  }, [lift, px, py])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={className}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
      ref={ref}
      style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
    >
      {mount && (
        // Paspartu: parçanın tam arkasında, 22px geride duran kum tonlu düzlem.
        // `aria-hidden` + `pointer-events-none` — tamamen görsel bir nesne,
        // ne odak alır ne de işaretçiyi yakalar.
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-sand"
          style={{ translateZ: -22, opacity: mountOpacity }}
        />
      )}
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX, rotateY, translateZ, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
