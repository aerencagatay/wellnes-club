'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { NAV_ITEMS, site } from '@/lib/config/site'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'

export function Navbar() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Menü açıkken Escape kapatır, gövde kaydırması durur, odak panelde kalır.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button')
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/90 backdrop-blur-[2px]">
      <div className="container-page flex h-18 items-center justify-between gap-8">
        <Link className="font-heading text-xl tracking-tight text-ink" href="/">
          {site.name}
        </Link>

        <nav aria-label={t('primary')} className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link className="text-sm text-ink-3 transition-colors hover:text-ink" href={item.href} key={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Button href="/basvuru" size="md">
            {t('cta')}
          </Button>
        </div>

        <button
          aria-expanded={open}
          aria-label={t('openMenu')}
          className="lg:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu className="size-6 text-ink" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-cream lg:hidden" ref={panelRef}>
          <div className="container-page flex h-18 items-center justify-between">
            <span className="font-heading text-xl text-ink">{site.name}</span>
            <button aria-label={t('closeMenu')} onClick={() => setOpen(false)} type="button">
              <X className="size-6 text-ink" />
            </button>
          </div>
          <nav aria-label={t('primary')} className="container-page mt-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                className="border-b border-border py-4 font-heading text-2xl text-ink"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-8 flex items-center justify-between">
              <LanguageSwitcher />
              <Button href="/basvuru" onClick={() => setOpen(false)} size="lg">
                {t('cta')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
