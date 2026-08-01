'use client'

import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

/** Bu kadar kaydırıldıktan sonra buton görünür olur. */
const SHOW_AFTER_PX = 600

export function BackToTop() {
  const t = useTranslations('common')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  const handleClick = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      aria-label={t('backToTop')}
      className="fixed bottom-24 left-5 z-40 flex size-13 items-center justify-center rounded-full bg-ink text-cream shadow-[var(--shadow-lift)] transition-transform hover:scale-105 lg:bottom-5"
      onClick={handleClick}
      type="button"
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  )
}
