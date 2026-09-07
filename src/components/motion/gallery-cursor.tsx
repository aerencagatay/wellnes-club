'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '@/lib/hooks/use-fine-pointer'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * GALERİ İMLECİ
 * =============================================================================
 * Fareyi geriden takip eden ince bir halka. Etkileşimli bir öğenin üzerine
 * gelindiğinde büyür ve dolar — sergi salonunda bir nesneye yaklaşırken
 * dikkatin odaklanması gibi.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NE ZAMAN HİÇ KURULMAZ — üç koşuldan biri yeterli:
 *
 *   1. `prefers-reduced-motion` — halkanın gecikmeli takibi sürekli bir
 *      hareket kaynağıdır.
 *   2. Kaba işaretçi (dokunmatik) — takip edilecek bir imleç yok; halka
 *      ekranın bir köşesinde donmuş kalırdı.
 *   3. Hover desteklenmiyor.
 *
 * Bu kontrol `matchMedia` ile ÇALIŞMA ANINDA yapılır, CSS ile değil: yerel
 * imleci gizleme kararı da buna bağlı ve CSS'te yapılsaydı, JS yüklenmeden
 * önceki kısa aralıkta ziyaretçi imleçsiz kalırdı.
 *
 * YEREL İMLEÇ NEDEN GİZLENİYOR: iki imleç (yerel ok + halka) aynı anda
 * görününce ekran dağınık okur ve halka bir "efekt" gibi durur, arayüzün
 * kendisi gibi değil. Halkanın kontrastı bu yüzden yüksek tutulmuştur
 * (zeytin, krem üzerinde 6.32:1) — imlecin nerede olduğu her zeminde
 * kaybolmadan okunur.
 *
 * ERİŞİLEBİLİRLİK: bileşen `aria-hidden` ve `pointer-events-none`. Odak
 * halkalarına, klavye gezinmesine ve tıklama hedeflerine hiç dokunmaz;
 * yalnızca görsel bir katman.
 */

/** İmlecin üzerinde büyüdüğü öğeler. */
const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], summary'

export function GalleryCursor() {
  const reduced = useReducedMotion()
  const finePointer = useFinePointer()
  // Halka YALNIZCA gerçek bir işaretçi varken ve hareket azaltma
  // istenmiyorken kurulur. İkisi de medya sorgusu olduğu için değer render
  // sırasında türetilir — efekt içinde `setState` ile değil (bkz.
  // use-fine-pointer.ts).
  const enabled = finePointer && !reduced
  const [active, setActive] = useState(false)
  // Fare pencereye girene kadar halka gizlidir: aksi halde sayfa açılışında
  // sol üst köşede (0,0) duran bir halka belirir ve oradan uçarak gelir.
  const [seen, setSeen] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Yumuşak ama geride kalan bir yay: halka fareye YAPIŞMAZ, onu izler.
  // Yapışan bir halka yerel imlecin kopyası olurdu ve hiçbir şey katmazdı.
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return

    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setSeen(true)
      // `closest` ile kontrol: fare bir düğmenin İÇİNDEKİ metne geldiğinde de
      // hedef o metin düğümü olur; en yakın etkileşimli atayı aramak, iç içe
      // işaretlemede halkanın rastgele sönmesini önler.
      setActive(Boolean((event.target as Element | null)?.closest?.(INTERACTIVE)))
    }
    const leave = () => setSeen(false)

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  // Yerel imleci gizleme, halka gerçekten etkinken YAPILIR ve bileşen
  // kaldırıldığında geri alınır — aksi halde bir sonraki sayfada imleç kayıp
  // kalırdı.
  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.style.cursor = 'none'
    return () => {
      root.style.cursor = ''
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <motion.span
      aria-hidden
      // `z-200` — SAYFANIN EN ÜST KATMANI, ve bu bir hatanın düzeltmesi.
      //
      // Halka `z-100`'deydi; program modalı da `z-100`. Modal `document.body`ye
      // portal ile SONRADAN ekleniyor, dolayısıyla aynı katmanda olsalar bile
      // modal üstte boyanıyordu. Yerel imleci gizlediğimiz için (bkz. yukarıdaki
      // not) sonuç, modalın üzerinde HİÇ imleç olmamasıydı — kullanıcı bunu
      // "imleç kayboluyor" diye bildirdi (2026-09-07).
      //
      // İmlecin katmanı tartışma konusu değil: nereye giderse gitsin görünmesi
      // gerekir, çünkü onu gizleyen biziz. Yeni bir kaplama eklerken bu değerin
      // ALTINDA kalmalı (bugün en yükseği modal: z-100).
      className="pointer-events-none fixed top-0 left-0 z-200 block rounded-full border border-olive mix-blend-multiply"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: active ? 52 : 26,
        height: active ? 52 : 26,
        opacity: seen ? 1 : 0,
        backgroundColor: active ? 'rgba(74, 90, 59, 0.16)' : 'rgba(74, 90, 59, 0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    />
  )
}
