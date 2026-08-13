'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * Hero'nun arkasındaki zemin. Fotoğrafın yerini alır (kullanıcı isteği,
 * 2026-08-14): sayfa artık tipografiyle taşınıyor, arkada yalnızca sitenin
 * kendi paletinden çok yavaş hareket eden iki geniş ışık havuzu var.
 *
 * MagicUI'nin `AuroraBackground`/`Particles` fikrinden uyarlanmıştır ama
 * canvas veya WebGL KULLANMAZ — iki blur'lu radyal gradyan yeterli, ve bu
 * sayede ana sayfanın ilk boyamasına hiç JS iş yükü binmez, mobil GPU'da
 * ısınma yaratmaz.
 *
 * Renkler paletin dışına çıkmaz: kum (#C9B99F) ve zeytin (#555D49), krem
 * zemin üzerinde düşük opaklıkla. Tamamen dekoratif (`aria-hidden`).
 */
export function AuroraBackdrop() {
  const reduced = useReducedMotion()

  // İki havuz da yerinde durur; yalnızca çok yavaşça kayar ve nefes alır.
  // 26/34 saniyelik asal olmayan farklı süreler, ikisinin senkron görünmesini
  // (ve dolayısıyla tek bir "atan" leke gibi okunmasını) engeller.
  const drift = reduced
    ? undefined
    : { x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }
  const driftAlt = reduced
    ? undefined
    : { x: [0, -50, 0], y: [0, 25, 0], scale: [1.05, 1, 1.05] }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={drift}
        className="absolute -top-1/4 left-[-10%] size-[70vw] rounded-full bg-sand/45 blur-[120px]"
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        animate={driftAlt}
        className="absolute right-[-15%] bottom-[-20%] size-[60vw] rounded-full bg-olive/25 blur-[130px]"
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
