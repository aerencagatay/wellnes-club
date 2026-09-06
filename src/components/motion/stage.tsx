'use client'

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * SAHNE — SİTENİN 3B DERİNLİK SİSTEMİ
 * =============================================================================
 * EDEN'in görsel dili DÜZDÜR: gölge yok, elevation yok, her yüzey kağıt (bkz.
 * globals.css). Bu, "derinlik olmasın" demek DEĞİL — derinliğin NEREDE
 * yaşadığını söylüyor.
 *
 *     YÜZEYDE DEĞİL, MEKÂNDA.
 *
 * Kağıt parçası hâlâ düz ve gölgesiz; ama o kağıdın ASILDIĞI oda gerçek bir
 * perspektife sahip. Ziyaretçi sayfayı kaydırdığında bir belgeyi değil, bir
 * galeriyi geziyor: parçalar farklı Z düzlemlerinde duruyor, yakındakiler
 * hızlı, uzaktakiler yavaş geçiyor, duvar kaydırmayla döner.
 *
 * Bu ayrım, "lüks 3B" isteğini parlak cam/gradient/neon efektlerine
 * SAPMADAN karşılamanın yolu: o efektler hem markayı hem de tasarım
 * yönergesinin kendi "yapma" listesini bozardı. Burada derinlik ışıktan değil,
 * PERSPEKTİFTEN ve HAREKETTEN geliyor — bir sergi salonunda yürümek gibi.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TEKNİK SÖZLEŞME
 *
 * `Stage` bir perspektif kökü kurar (`perspective` + `preserve-3d`). İçindeki
 * `Depth` bileşenleri Z ekseninde konumlanır. CSS perspektifi KALITSAL
 * DEĞİLDİR: `transform-style: preserve-3d` zinciri bir yerde kırılırsa (ör.
 * araya `overflow: hidden` veya `filter` taşıyan bir düğüm girerse) çocuklar
 * düzleşir ve derinlik sessizce kaybolur. Bu yüzden `Depth` her zaman `Stage`in
 * DOĞRUDAN çocuğu olmalıdır.
 *
 * HAREKET AZALTMA: `prefers-reduced-motion` altında perspektif de, Z kayması
 * da hiç KURULMAZ (yalnızca hızlandırılmaz). 3B dönüşümler vestibüler
 * rahatsızlığın en güçlü tetikleyicilerinden biridir; süreyi kısaltmak burada
 * yeterli bir uyum değildir.
 */

/**
 * Sahne bağlamı: `Depth`, kendi `useScroll`unu kurmak yerine sahnenin TEK
 * kaydırma ölçümünü paylaşır.
 *
 * NEDEN PAYLAŞILIYOR: her katman kendi `useScroll({ target })`ünü kursaydı,
 * aynı kare içinde N ayrı `getBoundingClientRect()` ölçümü yapılırdı — bu,
 * tarayıcıyı her katman için yeniden layout hesabına zorlar (layout thrashing)
 * ve on parçalı bir kolajda kare düşmesi olarak görünür. Tek ölçüm, N katman.
 */
type StageContext = {
  /** Sahnenin görünümden geçiş ilerlemesi: 0 (altta) → 1 (üstte). */
  progress: MotionValue<number>
  reduced: boolean
}

const StageCtx = createContext<StageContext | null>(null)

function useStage(): StageContext {
  const ctx = useContext(StageCtx)
  if (!ctx) {
    // Sessizce düz bir görünüme düşmek yerine hata veriyoruz: `Depth` bir
    // `Stage` dışında kullanıldığında perspektif kökü olmaz ve bileşen
    // ÇALIŞIR ama HİÇBİR derinlik üretmez. Bu, fark edilmesi en zor hata
    // türüdür — "çalışıyor gibi görünen ama hiçbir şey yapmayan kod".
    throw new Error('<Depth> yalnızca bir <Stage> içinde kullanılabilir.')
  }
  return ctx
}

/**
 * Perspektif kökü.
 *
 * `perspective` DEĞERİ NE ANLAMA GELİR: izleyicinin ekrandan uzaklığı (px).
 * Küçük değer = geniş açı = agresif, "balık gözü" bir 3B. Büyük değer = uzun
 * lens = yumuşak, sinematik derinlik. 1400px kasıtlı olarak UZUN lens
 * tarafındadır: bu bir oyun değil, bir galeri — perspektif fark edilmeli ama
 * dikkat çekmemeli.
 */
export function Stage({
  children,
  className = '',
  perspective = 1400,
  /** Kaydırma ölçümünün başlangıç/bitiş eşikleri (motion `offset` sözdizimi). */
  offset = ['start end', 'end start'] as const,
}: {
  children: ReactNode
  className?: string
  perspective?: number
  offset?: readonly [string, string]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // @ts-expect-error — motion'ın `offset` tipi geniş bir birleşim; buradaki
    // salt-okunur ikili onun kabul ettiği biçimin ta kendisi ama `readonly`
    // olduğu için eşleşmiyor.
    offset,
  })

  /**
   * Yay (spring) yumuşatması sinematik hissin ASIL kaynağı: ham
   * `scrollYProgress` tekerleğin her tık'ında sıçrar ve 3B dönüşümlerde bu
   * "titreme" olarak görünür. Yay, kamerayı fiziksel bir ağırlığa
   * kavuşturur — dolly çeken bir vinç gibi.
   */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <StageCtx.Provider value={{ progress, reduced }}>
      <div
        className={className}
        ref={ref}
        style={
          reduced
            ? undefined
            : { perspective: `${perspective}px`, transformStyle: 'preserve-3d' }
        }
      >
        {children}
      </div>
    </StageCtx.Provider>
  )
}

/**
 * Sahne içinde bir Z düzlemi.
 *
 * `z` NEGATİFSE UZAKTA, POZİTİFSE YAKINDA. Uzaktaki katman perspektif gereği
 * KÜÇÜLÜR — bu istenen etkidir ama düzeni bozar: 800px geride duran bir başlık
 * gözle görülür biçimde küçülür. `compensateScale` bunu telafi eder: katman,
 * uzaklığının tam tersi oranda büyütülür, böylece EKRANDAKİ BOYUTU değişmez
 * ama parallax'ı ve örtüşme sırası derinliği korunur. Sinemadaki "dolly zoom"un
 * tersi: orada efekt istenir, burada istenmez.
 */
export function Depth({
  children,
  className = '',
  z = 0,
  /** Kaydırma boyunca uygulanacak ek dikey kayma (px). Katmanı ayrıştırır. */
  y = 0,
  /** Kaydırma boyunca uygulanacak X ekseni dönüşü (derece). */
  rotateX = 0,
  compensateScale = true,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  z?: number
  y?: number
  rotateX?: number
  compensateScale?: boolean
  as?: 'div' | 'li' | 'span'
}) {
  const { progress, reduced } = useStage()
  const MotionTag = motion[as]

  // Perspektif p'de, z kadar geride duran bir yüzey p/(p-z) oranında küçülür.
  // Telafi tam olarak bunun tersidir. `z` pozitifken (yakın) oran 1'in altına
  // düşer ve katman küçültülür — yine aynı mantık.
  const PERSPECTIVE = 1400
  const scale = compensateScale ? (PERSPECTIVE - z) / PERSPECTIVE : 1

  // Katman görünüme girerken `y` kadar aşağıdan gelir, çıkarken yukarı süzülür.
  // Aralık [-y, y] değil [y, -y]: kaydırma AŞAĞI giderken içerik YUKARI
  // akmalı, aksi halde hareket sayfayla ters yönde okunur.
  const translateY = useTransform(progress, [0, 1], [y, -y])
  const tiltX = useTransform(progress, [0, 0.5, 1], [rotateX, 0, -rotateX])

  if (reduced) {
    return <MotionTag className={className}>{children}</MotionTag>
  }

  return (
    <MotionTag
      className={className}
      style={{
        translateZ: z,
        scale,
        y: translateY,
        rotateX: rotateX === 0 ? undefined : tiltX,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </MotionTag>
  )
}
