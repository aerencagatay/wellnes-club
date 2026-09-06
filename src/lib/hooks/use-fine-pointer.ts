'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

// Modül kapsamında bir kez oluşturulur — her render'da yeniden `matchMedia`
// çağırmak yerine tek bir `MediaQueryList` yeniden kullanılır. SSR'de (Node
// ortamında modül değerlendirilirken) `window` yok, bu yüzden `null` ile
// korunur.
const mediaQuery = typeof window === 'undefined' ? null : window.matchMedia(QUERY)

function subscribe(onChange: () => void): () => void {
  if (!mediaQuery) return () => {}
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return mediaQuery ? mediaQuery.matches : false
}

function getServerSnapshot(): boolean {
  return false
}

/**
 * Cihazın gerçek bir işaretçisi (fare/kalem) olup olmadığını izler.
 *
 * `use-reduced-motion.ts` ile AYNI kalıbı kullanır ve aynı sebeple:
 * `useSyncExternalStore` SSR'de ve hydration sırasında her zaman `false`
 * döner — bu, sunucunun ürettiği işaretlemeyle eşleşir ve hydration
 * uyuşmazlığı yaratmaz — ardından gerçek `matchMedia` değerine senkronize
 * olur.
 *
 * NEDEN `useEffect` + `useState` DEĞİL: efekt gövdesinde senkron `setState`
 * çağırmak basamaklı render'a yol açar (React'in kendi uyarısı) ve ilk
 * boyamada yanlış durumla bir kare çizilir. Harici bir sistemi (medya sorgusu)
 * okumanın doğru aracı bu kanca.
 *
 * ÇALIŞMA ANINDA DEĞİŞEBİLİR: dizüstü bilgisayara fare takılıp çıkarıldığında
 * veya bir tablet klavye/trackpad kılıfına oturtulduğunda sorgu gerçekten
 * yeniden değerlendirilir — bu yüzden tek seferlik bir okuma yerine abonelik
 * kuruluyor.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
