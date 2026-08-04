'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Modül kapsamında bir kez oluşturulur — her render'da yeniden
// `matchMedia` çağırmak yerine tek bir `MediaQueryList` yeniden kullanılır.
// SSR'de (Node ortamında modül değerlendirilirken) `window` yok, bu yüzden
// `null` ile korunur.
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
 * `prefers-reduced-motion: reduce` durumunu izler.
 *
 * `useSyncExternalStore` kullanır: SSR'de (ve hydration sırasında) her zaman
 * `false` döner — bu, sunucunun ürettiği işaretlemeyle eşleşir ve hydration
 * uyuşmazlığı yaratmaz — ardından gerçek `matchMedia` değerine senkronize
 * olur ve işletim sistemi ayarı değiştikçe güncellenir.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
