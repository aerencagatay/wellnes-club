'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { NAV_ITEMS, site } from '@/lib/config/site'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'

const MOBILE_PANEL_ID = 'mobile-nav-panel'
const MOBILE_PANEL_TITLE_ID = 'mobile-nav-panel-title'

const SCROLL_THRESHOLD = 40

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Şeffaf-üzeri-hero tedavisi güvenli değildir: brief metniyle uyumlu olarak
  // yalnızca gerçek bir koyu hero (`bg-dark` — bkz. hero-home.tsx,
  // camp-detail-hero.tsx, page-hero.tsx'in görsel varyantı) sayfanın en üstünde
  // varken uygulanmalı. Aksi halde (`sss`, `iletişim`, `kvkk` gibi görselsiz
  // PageHero sayfalarında) `text-background` logosu/menüsü krem zemin üzerinde
  // görünmez olur — bu, tarayıcı denetiminde gözlendi. `Navbar`, `(public)/layout.tsx`
  // içinde tüm rotalarda kalıcı olduğundan (App Router aynı layout'ta yeniden
  // bağlanmaz) bu, `pathname` her değiştiğinde yeniden ölçülür.
  const [hasHeroBackdrop, setHasHeroBackdrop] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const detectHeroBackdrop = () => {
      const firstChild = document.querySelector('main')?.firstElementChild
      setHasHeroBackdrop(firstChild?.classList.contains('bg-dark') ?? false)
    }
    detectHeroBackdrop()
  }, [pathname])

  // Şeffaf (hero üzeri) → opak (krem zemin) geçişi: yalnızca sunum amaçlı,
  // menünün açık/kapalı mantığından bağımsız bir `scrolled` durumu. Yalnızca
  // `background-color`/`border-color`/`color` geçer (brief: "Geçiş yalnızca
  // background-color, border-color").
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = hasHeroBackdrop && !scrolled

  // Menü açıkken odak panele taşınır, Escape kapatır, gövde kaydırması durur,
  // Tab panelde döner; kapanışta (Escape / X / bağlantı) odak tetikleyiciye döner.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button:not([disabled])')
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
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-sand/60 bg-background/92 backdrop-blur-[2px]'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-8">
        <Link
          className={`font-heading text-xl tracking-tight transition-colors duration-300 ${
            transparent ? 'text-background' : 'text-text'
          }`}
          href="/"
        >
          {site.name}
        </Link>

        <nav aria-label={t('primary')} className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              className={`text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
                transparent ? 'text-background/80 hover:text-background' : 'text-muted hover:text-text'
              }`}
              href={item.href}
              key={item.href}
            >
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
          aria-controls={MOBILE_PANEL_ID}
          aria-expanded={open}
          aria-label={t('openMenu')}
          className="lg:hidden"
          onClick={() => setOpen(true)}
          ref={triggerRef}
          type="button"
        >
          <Menu className={`size-6 transition-colors duration-300 ${transparent ? 'text-background' : 'text-text'}`} />
        </button>
      </div>

      {open && (
        <div
          aria-labelledby={MOBILE_PANEL_TITLE_ID}
          aria-modal="true"
          className="fixed inset-0 z-50 bg-background lg:hidden"
          id={MOBILE_PANEL_ID}
          ref={panelRef}
          role="dialog"
        >
          <div className="container-page flex h-18 items-center justify-between">
            <span className="font-heading text-xl text-text" id={MOBILE_PANEL_TITLE_ID}>
              {site.name}
            </span>
            <button aria-label={t('closeMenu')} onClick={() => setOpen(false)} ref={closeButtonRef} type="button">
              <X className="size-6 text-text" />
            </button>
          </div>
          <nav aria-label={t('primary')} className="container-page mt-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                className="border-b border-sand py-4 font-heading text-2xl text-text"
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
