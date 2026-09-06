'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * =============================================================================
 * PERDE — SAYFALAR ARASI GEÇİŞ
 * =============================================================================
 * Yeni bir sayfa açıldığında zeytin bir panel ekranı kaplar ve yukarı çekilir.
 * Bir sergi salonundan diğerine geçerken aradaki kısa karanlık gibi: iki oda
 * birbirine karışmaz, ayrı ayrı hatırlanır.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN YALNIZCA "GİRİŞ" ANİMASYONU VAR, "ÇIKIŞ" YOK: App Router'da bir
 * gezinme, yeni sayfa hazır olduğunda ANINDA yapılır. Ayrılan sayfayı
 * animasyonla uğurlamak için her bağlantı tıklamasını yakalayıp gezinmeyi
 * geciktirmek gerekirdi — bu, hızlı gezinen bir ziyaretçi için sitenin
 * yavaşlaması anlamına gelir ve tarayıcının geri/ileri düğmeleriyle de
 * bozulur. Perde bu yüzden yalnızca VARIŞTA oynar: gecikme sıfır, his aynı.
 *
 * İLK YÜKLEMEDE OYNAMAZ (`firstRender`): sayfa zaten boştan geliyor; üstüne
 * bir de perde çekmek ilk boyamayı geciktirir ve açılışı ağırlaştırır.
 *
 * ERİŞİLEBİLİRLİK: panel `aria-hidden` ve `pointer-events-none` — 520ms
 * boyunca ekranı kaplasa da hiçbir tıklamayı yutmaz, odak sırasına girmez.
 * Ekran okuyucu için sayfa geçişi zaten `<main>` içeriğinin değişmesiyle
 * duyurulur.
 *
 * HAREKET AZALTMA: perde hiç kurulmaz; gezinme anında ve sessiz olur.
 */
export function Curtain() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const firstRender = useRef(true)
  const [key, setKey] = useState<string | null>(null)

  useEffect(() => {
    if (reduced) return
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    // `pathname` anahtar olarak kullanılır: aynı sayfaya yeniden gezinmek
    // (ör. navbar'daki aktif bağlantıya tıklamak) perdeyi yeniden
    // tetiklemez, çünkü anahtar değişmez.
    setKey(pathname)
  }, [pathname, reduced])

  useEffect(() => {
    if (!key) return
    // Perde kendini temizler: animasyon süresinden biraz uzun bir zamanlayıcı
    // paneli DOM'dan çıkarır. `onAnimationComplete`e bağlamak, sekme arka
    // plandayken (requestAnimationFrame durur) panelin ekranda takılı
    // kalmasına yol açardı.
    const timer = window.setTimeout(() => setKey(null), 900)
    return () => window.clearTimeout(timer)
  }, [key])

  if (reduced) return null

  return (
    <AnimatePresence>
      {key && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-90 field-forest grain"
          // Panel tam kapalı başlar ve YUKARI çekilir. `scaleY` + `origin-top`
          // kullanılır, `height` değil: yükseklik animasyonu her karede
          // layout hesabı tetikler; `transform` yalnızca compositor'da çalışır.
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          key={key}
          style={{ originY: 0 }}
          // Uzun, yumuşak bir çıkış eğrisi (expo-out): panel hızlı başlar,
          // yavaşça biter — bir perdenin gerçek ağırlığı böyle okunur.
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
