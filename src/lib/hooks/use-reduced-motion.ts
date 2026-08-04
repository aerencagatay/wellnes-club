'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
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
