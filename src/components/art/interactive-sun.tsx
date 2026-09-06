'use client'

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'
import { SunMark } from './marks'

/**
 * =============================================================================
 * ETKİLEŞİMLİ GÜNEŞ — SAYFANIN CANLI AMBLEMİ
 * =============================================================================
 * Hero'daki güneş artık çizim değil, DAVRANIŞ. İmleç yaklaştıkça:
 *
 *   1. Çekirdek büyür (imleç merkezdeyken ~1.18×).
 *   2. Bütün saçaklar uzar.
 *   3. İMLECE BAKAN saçaklar diğerlerinden ÇOK DAHA FAZLA uzar ve o yöne
 *      hafifçe yatar — güneş imlece "uzanıyor" gibi görünür.
 *   4. İkinci bir kısa saçak halkası belirir: ışıma.
 *   5. Tıklanınca tek seferlik bir patlama olur.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IŞIK NEDEN PARLAKLIKLA DEĞİL MÜREKKEPLE ANLATILIYOR
 *
 * "Işık saçma"nın alışıldık web karşılığı bir radial-gradient halo veya
 * `filter: blur()` parıltısıdır. İkisi de bu sistemde YASAK (bkz. globals.css:
 * gradient yok, parlaklık yok, gölge yok) ve ikisi de kağıt dilini anında
 * dijitalleştirir.
 *
 * Baskı geleneğinde ışık ZATEN böyle anlatılmaz: bir linolyum ya da ahşap
 * baskıda güneşin ışıması, çevresine EKLENEN ÇİZGİLERLE gösterilir. Burada da
 * öyle — ışık arttıkça mürekkep artıyor. Böylece efekt hem markanın dilinde
 * kalıyor hem de tek renk (`currentColor`) olduğu için her zeminde çalışıyor.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN PENCERE ÇAPINDA DİNLİYOR, `onPointerEnter` DEĞİL
 *
 * İstenen davranış "üzerine gelince" değil, "YAKLAŞTIKÇA". Hover olayları
 * ikili (içeride/dışarıda) ve yalnızca öğenin kendi kutusunda tetiklenir; bu
 * da güneşin ancak imleç tam üstündeyken uyanması demek olurdu. Mesafeye
 * bağlı sürekli bir tepki için imlecin sahnedeki konumunu sürekli bilmek
 * gerekiyor.
 *
 * PERFORMANS: tek bir pencere dinleyicisi var ve React state'i GÜNCELLEMİYOR —
 * yalnızca iki motion value yazıyor. Kare başına yeniden render yok.
 * `getBoundingClientRect` her harekette DEĞİL, yalnızca boyut/kaydırma
 * değiştiğinde okunuyor (layout thrashing'i önlemek için önbellekli).
 */

/** İmlecin etkisinin başladığı yarıçap (px). Bunun ötesinde güneş sakin. */
const INFLUENCE_RADIUS = 460

/**
 * Işın açıları (derece) ve temel uzunlukları. Eşit aralıklı DEĞİL — düzenli
 * bir `map(i => i * 25.7)` matematiksel bir yıldız üretir, elle çizilmiş bir
 * güneş gibi durmaz. `marks.tsx`'teki statik sürümle aynı liste.
 */
const RAYS: [angle: number, length: number][] = [
  [0, 21], [26, 17], [53, 20], [78, 16], [104, 21], [131, 18],
  [155, 20], [180, 17], [206, 21], [232, 16], [258, 20], [284, 18],
  [310, 21], [336, 17],
]

/** Işıma halkası: ana saçakların arasına giren kısa çizgiler. */
const HALO = [13, 39, 65, 91, 117, 143, 169, 195, 221, 247, 273, 299, 325, 351]

const TO_RAD = Math.PI / 180

/**
 * Hesaplanan koordinatları sabit basamağa yuvarlar — `marks.tsx`'teki `round`
 * ile aynı gerekçe: trigonometri Node ile tarayıcı arasında son basamakta
 * ayrışıp hydration uyuşmazlığı üretiyor. Buradaki değerler istemcide
 * hesaplansa da ilk render sunucudan geliyor.
 */
const round = (value: number): number => Math.round(value * 1000) / 1000

export function InteractiveSun({
  className = '',
  /** Işımanın ne kadar taşacağı — çok büyük güneşlerde düşürün. */
  intensity = 1,
}: {
  className?: string
  intensity?: number
}) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [burst, setBurst] = useState(0)

  // İmlecin güneş merkezine göre birim vektörü ve yakınlığı.
  // `strength`: 0 (uzak) → 1 (merkezde).
  const dirX = useMotionValue(0)
  const dirY = useMotionValue(0)
  const strength = useMotionValue(0)

  // Ağır yay: güneş imlece YAPIŞMAZ, ona doğru salınır. Sert bir yay bunu
  // ucuz bir hover efektine çevirirdi.
  const SPRING = { stiffness: 110, damping: 20, mass: 0.9 }
  const sDirX = useSpring(dirX, SPRING)
  const sDirY = useSpring(dirY, SPRING)
  const sStrength = useSpring(strength, { stiffness: 90, damping: 18, mass: 0.8 })

  const measure = useCallback(() => {
    rectRef.current = wrapRef.current?.getBoundingClientRect() ?? null
  }, [])

  useEffect(() => {
    if (reduced) return
    measure()

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = rectRef.current
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)

      // Yakınlık DOĞRUSAL DEĞİL, kareli sönümlü: imleç uzaktayken güneş
      // tamamen sakin kalsın, yalnızca gerçekten yaklaşınca uyansın istiyoruz.
      // Doğrusal bir düşüş, ekranın yarısında sürekli titreyen bir amblem
      // üretiyordu.
      const t = Math.max(0, 1 - dist / INFLUENCE_RADIUS)
      strength.set(t * t)

      if (dist > 0.001) {
        dirX.set(dx / dist)
        dirY.set(dy / dist)
      }
    }

    // Kaydırma ve yeniden boyutlandırma öğenin ekrandaki yerini değiştirir;
    // önbelleklenen dikdörtgen o anda geçersizleşir. `pointermove` içinde
    // ölçmek her karede layout okuması demekti.
    const onResize = () => measure()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onResize, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onResize)
      window.removeEventListener('resize', onResize)
    }
  }, [dirX, dirY, measure, reduced, strength])

  // Tıklama patlaması: tek seferlik, kendi kendini temizleyen bir sayaç.
  const handleClick = useCallback(() => {
    setBurst((n) => n + 1)
  }, [])

  useEffect(() => {
    if (burst === 0) return
    const timer = window.setTimeout(() => setBurst(0), 620)
    return () => window.clearTimeout(timer)
  }, [burst])

  const coreScale = useTransform(sStrength, [0, 1], [1, 1 + 0.18 * intensity])
  const haloOpacity = useTransform(sStrength, [0.15, 1], [0, 0.85])
  const haloScale = useTransform(sStrength, [0, 1], [0.86, 1])

  if (reduced) {
    // Hareket azaltmada amblem tamamen durağan: sürekli tepki veren bir öğe
    // tam olarak bu tercihin dışladığı şey. Statik sürüm birebir aynı çizim.
    return <SunMark className={className} />
  }

  return (
    <motion.span
      className={cn('block cursor-pointer', className)}
      onClick={handleClick}
      ref={wrapRef}
      // Tıklamada tek seferlik bir zıplama — "dokundum ve karşılık verdi".
      animate={burst > 0 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* `overflow: visible` — GÖRÜNÜR BİR HATANIN DÜZELTMESİ, süsleme değil.
          SVG kökü tarayıcı varsayılanında `overflow: hidden` taşır, yani
          `viewBox` dışına çıkan hiçbir şey boyanmaz. Bu güneşin saçakları
          büyüdüğünde 100 birimlik kutuyu AŞIYOR:

            saçak ucu  = 24 + 21 × 1.88 ≈ 63.5  →  merkezden 113.5
            halka ucu  = 56                     →  merkezden 106
            kutu sınırı                          =  100

          Sonuç, ışık saçarken görünen kare bir kesme çizgisiydi (kullanıcı
          bildirimi, 2026-09-07): güneş sanki görünmez bir çerçeveye çarpıyordu.

          NEDEN `viewBox` BÜYÜTÜLMEDİ: kutuyu ör. 148 birime çıkarmak aynı CSS
          alanında güneşi ~%32 küçültürdü ve düzeltmeyi kapatmak için hero'daki
          ölçüyü de büyütmek gerekirdi. `overflow: visible` ise tek satır,
          koordinatlara ve yerleşime hiç dokunmuyor. */}
      <svg
        aria-hidden
        className="block h-full w-full overflow-visible"
        fill="none"
        viewBox="0 0 100 100"
      >
        {/* IŞIMA HALKASI — yalnızca imleç yaklaşınca belirir. Ana saçakların
            ARASINA denk gelen kısa çizgiler; ışık arttıkça mürekkep artıyor. */}
        <motion.g style={{ opacity: haloOpacity, scale: haloScale, originX: '50px', originY: '50px' }}>
          {HALO.map((angle) => {
            const rad = angle * TO_RAD
            const x1 = round(50 + Math.cos(rad) * 48)
            const y1 = round(50 + Math.sin(rad) * 48)
            const x2 = round(50 + Math.cos(rad) * 56)
            const y2 = round(50 + Math.sin(rad) * 56)
            return (
              <line
                key={angle}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.6"
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
              />
            )
          })}
        </motion.g>

        {/* ÇEKİRDEK */}
        <motion.circle
          cx="50"
          cy="50"
          fill="currentColor"
          r="21"
          style={{ scale: coreScale, originX: '50px', originY: '50px' }}
        />

        {/* ANA SAÇAKLAR — her biri kendi bileşeni, çünkü kanca kuralları bir
            döngü içinde `useTransform` çağırmaya izin vermiyor. */}
        {RAYS.map(([angle, length]) => (
          <Ray
            angle={angle}
            baseLength={length}
            dirX={sDirX}
            dirY={sDirY}
            intensity={intensity}
            key={angle}
            strength={sStrength}
          />
        ))}
      </svg>
    </motion.span>
  )
}

/**
 * Tek bir saçak.
 *
 * İMLECE UZANMA NASIL ÇALIŞIYOR: saçağın kendi yönü ile imlecin yönü
 * arasındaki HİZA, iki birim vektörün nokta çarpımıdır (`cos` farkı). Hiza 1
 * ise saçak tam imlece bakıyordur ve en çok uzar; 0 ve altındaysa hiç ek
 * uzunluk almaz. Negatif değerleri kırpmak önemli: kırpılmazsa arka taraftaki
 * saçaklar KISALIR ve güneş bir yöne doğru ezilmiş gibi görünür — istenen şey
 * uzanmak, deforme olmak değil.
 *
 * Ayrıca saçak, imleç yönüne doğru birkaç derece YATAR. Bu tek başına çok
 * ince bir jest ama uzamayla birleşince "çekiliyor" hissini veren asıl şey o.
 */
function Ray({
  angle,
  baseLength,
  dirX,
  dirY,
  strength,
  intensity,
}: {
  angle: number
  baseLength: number
  dirX: MotionValue<number>
  dirY: MotionValue<number>
  strength: MotionValue<number>
  intensity: number
}) {
  const rad = angle * TO_RAD
  const rayX = Math.cos(rad)
  const rayY = Math.sin(rad)

  // Saçağın kökü sabit — yalnızca ucu hareket eder.
  const x1 = round(50 + rayX * 24)
  const y1 = round(50 + rayY * 24)

  const tip = useTransform([dirX, dirY, strength], (input) => {
    const [dx, dy, s] = input as [number, number, number]
    const alignment = Math.max(0, rayX * dx + rayY * dy)

    // Uzunluk: herkese biraz (0.18), imlece bakana çok (0.7'ye kadar).
    const grow = 1 + s * intensity * (0.18 + 0.7 * alignment)

    // Yatma: imleç yönüne doğru en fazla ~9°. `çapraz çarpım` işareti hangi
    // tarafa dönmesi gerektiğini verir.
    const cross = rayX * dy - rayY * dx
    const tilt = -cross * s * intensity * 9 * TO_RAD

    const a = rad + tilt
    const len = 24 + baseLength * grow
    return [round(50 + Math.cos(a) * len), round(50 + Math.sin(a) * len)] as [number, number]
  })

  const x2 = useTransform(tip, (t) => t[0])
  const y2 = useTransform(tip, (t) => t[1])
  // İmlece bakan saçak biraz da KALINLAŞIR: uzunluk tek başına yön duygusunu
  // yeterince taşımıyordu.
  const width = useTransform([dirX, dirY, strength], (input) => {
    const [dx, dy, s] = input as [number, number, number]
    const alignment = Math.max(0, rayX * dx + rayY * dy)
    return 5 + s * alignment * 1.6
  })

  return (
    <motion.line
      stroke="currentColor"
      strokeLinecap="round"
      style={{ strokeWidth: width }}
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
    />
  )
}
