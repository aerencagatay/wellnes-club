'use client'

import { motion, useAnimationControls } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'

/**
 * =============================================================================
 * İNTERAKTİF STICKER — SAYFAYA YAPIŞTIRILMIŞ KARAKTER
 * =============================================================================
 * Kesilip sayfaya yapıştırılmış bir karakter. Üzerine gelindiğinde kabarır,
 * tıklandığında birkaç adım yürür; kenara varınca döner ve geri yürür.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HAREKET DİLİ: KESME KAĞIT, KARAKTER ANİMASYONU DEĞİL
 *
 * Elimizdeki varlık TEK bir düz PNG — bacaklar ayrı oynatılamaz, yürüyüş
 * döngüsü çizilemez. Bu bir kısıt gibi görünüyor ama DOĞRU dil: kesme kağıt
 * animasyonunda (fanzin, gölge oyunu, kağıt kukla) karakter zaten eklemli ve
 * biraz serttir. Hareket şuradan gelir:
 *
 *   - ZIPLAMA: her adım küçük bir yay çizer, düz kaymaz.
 *   - EZİLME/UZAMA: yere basarken yassılır, havalanırken uzar — kağıdın
 *     ağırlığını veren şey bu.
 *   - EĞİLME: gidiş yönüne doğru birkaç derece yatar.
 *
 * Pürüzsüz bir "yürüyüş" burada yanlış olurdu: düz kayan bir kesik kağıt,
 * kağıt olmaktan çıkıp bir arayüz öğesine dönüşür.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN TEK BİR KEYFRAME ANİMASYONU — İKİNCİ BİR HATANIN DÜZELTMESİ
 *
 * Yürüyüş önce zincirlenmiş `await controls.start(...)` çağrılarıyla
 * kuruluyordu: her adım için havalan → in → toparlan, üç ayrı bekleme.
 * ÇALIŞMADI. Ölçüldü: tek tıklamada karakter TEK adım atıp ilk karede
 * (havalanma: scaleX 0.97 / scaleY 1.06) donuyordu — zincirdeki ikinci
 * `start()` hiç tamamlanmıyordu.
 *
 * Şimdi bütün yürüyüş TEK bir animasyon: her dönüşüm için bir kare dizisi ve
 * ortak bir `times` çizelgesi. Beklenecek söz (promise) yok, iptal edilecek
 * ara adım yok, bayat kapanış (closure) yok. Ayrıca doğrusu da bu — yürüyüş
 * kavramsal olarak TEK bir hareket, birbirine zincirlenmiş üç ayrı animasyon
 * değil.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN İKİ İÇ İÇE KATMAN VAR — BİRİNCİ HATANIN DÜZELTMESİ
 *
 * İlk sürümde yürüyüş (`animate={controls}`) ve hover (`whileHover`) AYNI
 * öğedeydi. Motion'da bir jest, `animate` propunu EZER; ikisi de aynı dönüşüm
 * matrisini yazdığı için yürüyüşün ölçek adımları yarıda kesiliyordu.
 * Ölçüldü: karakter tek sıçrayıp donuyor ve `scaleX 1.05 / scaleY 0.93`
 * (çömelmiş) hâlde kalıyordu.
 *
 * Çözüm sorumlulukları AYIRMAK:
 *   DIŞ katman  → yürüyüş (x, y, rotate, squash) — yalnızca `controls`.
 *   İÇ katman   → hover kabarması ve yön aynası — yalnızca jest.
 * İki ayrı matris, çakışma yok.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ERİŞİLEBİLİRLİK
 *
 * Sticker DEKORATİFTİR — bilgi taşımaz, bir yere götürmez. Bu yüzden `<button>`
 * DEĞİL: klavye sırasına girip "burada tıklanacak bir şey var" demesi,
 * karşılığı yalnızca bir animasyon olan bir öğe için yanıltıcı olurdu. Görsel
 * `alt=""` + `aria-hidden` ile ekran okuyucudan tamamen gizlenir.
 *
 * HAREKET AZALTMA: karakter tamamen durağan durur; tıklama ve hover hiçbir şey
 * yapmaz. Sürekli tepki veren dekoratif bir öğe tam olarak bu tercihin
 * dışladığı şeydir.
 */

/** Tek adımın yatay mesafesi (px) ve zıplama yüksekliği. */
const STEP_X = 26
const HOP_Y = -14

/**
 * Başlangıç noktasından iki yana gidebileceği en fazla mesafe (px).
 *
 * SINIR ŞART: sınırsızken karakter her tıklamada aynı yöne gidiyordu ve
 * birkaç tıklamadan sonra kabından çıkıp kayboluyordu. Sınıra varınca yön
 * değişir; inek bir aşağı bir yukarı otlar.
 */
const RANGE = 150

/** Bir adımın evreleri (sn): havalanma, iniş, toparlanma. */
const LIFT = 0.19
const LAND = 0.13
const SETTLE = 0.1
const STEP_T = LIFT + LAND + SETTLE

export function InteractiveSticker({
  src,
  alt,
  width,
  height,
  className = '',
  /** Tek tıklamada kaç adım atsın. */
  steps = 3,
  /** Görselin baktığı yön: 1 sağa, -1 sola. Aynalama buna göre hesaplanır. */
  facing = 1,
  priority = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  steps?: number
  facing?: 1 | -1
  priority?: boolean
}) {
  const reduced = useReducedMotion()
  const controls = useAnimationControls()
  const [heading, setHeading] = useState<1 | -1>(1)
  // Yürüme sırasında ikinci bir tıklamayı yok saymak için. `useRef`, çünkü
  // async döngünün içinden okunuyor ve state'in bayat kopyası hatalı olurdu.
  const busy = useRef(false)
  const offset = useRef(0)

  const walk = useCallback(() => {
    if (reduced || busy.current) return
    busy.current = true

    // Bütün yürüyüşü TEK bir kare dizisine aç. `t` mutlak saniye biriktirir;
    // en sonda 0-1 aralığına normalize edilir (motion `times` böyle ister).
    const x: number[] = [offset.current]
    const y: number[] = [0]
    const rotate: number[] = [0]
    const scaleX: number[] = [1]
    const scaleY: number[] = [1]
    const t: number[] = [0]

    let dir = heading
    let cursor = offset.current
    let elapsed = 0

    for (let i = 0; i < steps; i++) {
      // Sınıra varıldıysa dön; kalan adımlar ters yöne gider.
      if (Math.abs(cursor + STEP_X * dir) > RANGE) dir = (dir === 1 ? -1 : 1) as 1 | -1
      cursor += STEP_X * dir

      // 1) Havalanma — ileri, yukarı, yöne doğru yat, UZA.
      elapsed += LIFT
      x.push(cursor); y.push(HOP_Y); rotate.push(4 * dir); scaleX.push(0.97); scaleY.push(1.06); t.push(elapsed)
      // 2) İniş — konum sabit, form EZİLİR.
      elapsed += LAND
      x.push(cursor); y.push(0); rotate.push(0); scaleX.push(1.05); scaleY.push(0.93); t.push(elapsed)
      // 3) Toparlanma — kağıdın esnekliği.
      elapsed += SETTLE
      x.push(cursor); y.push(0); rotate.push(0); scaleX.push(1); scaleY.push(1); t.push(elapsed)
    }

    offset.current = cursor
    setHeading(dir)

    const total = steps * STEP_T
    void controls
      .start({
        x, y, rotate, scaleX, scaleY,
        transition: { duration: total, times: t.map((v) => v / total), ease: 'easeInOut' },
      })
      .finally(() => {
        busy.current = false
      })
  }, [controls, heading, reduced, steps])

  // Bileşen kaldırılırken devam eden animasyonu durdur: aksi halde motion
  // ayrılmış bir düğüme yazmayı sürdürür.
  useEffect(() => () => controls.stop(), [controls])

  // `alt=""` + `aria-hidden`: karakter DEKORATİF, ekran okuyucuya duyurulmaz.
  // `alt` prop'u yine de zorunlu tutuluyor — çağıranın "bu görsel ne?" sorusuna
  // cevap vermeden sticker yerleştirmesini engelliyor ve geliştirme ortamında
  // `data-sticker` olarak DOM'da görünüyor.
  const picture = (
    <Image
      alt=""
      aria-hidden
      data-sticker={process.env.NODE_ENV === 'production' ? undefined : alt}
      height={height}
      priority={priority}
      src={src}
      width={width}
    />
  )

  if (reduced) {
    return <span className={cn('block', className)}>{picture}</span>
  }

  return (
    <motion.span
      animate={controls}
      className={cn('block cursor-pointer select-none', className)}
      onClick={walk}
      // `originY: 1` — bütün dönüşümler AYAKLARDAN olur. Merkezden döndürmek
      // karakteri havada takla atıyor gibi gösteriyordu; kağıt kukla ayağından
      // oynar.
      style={{ originX: 0.5, originY: 1, willChange: 'transform' }}
    >
      {/* İÇ KATMAN: yalnızca hover ve yön aynası. Yürüyüş matrisine dokunmaz
          (bkz. başlıktaki "iki iç içe katman" notu). */}
      <motion.span
        animate={{ scaleX: heading === facing ? 1 : -1 }}
        className="block"
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        whileHover={{ scale: 1.07 }}
      >
        {picture}
      </motion.span>
    </motion.span>
  )
}
