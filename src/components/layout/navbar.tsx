'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { PRIMARY_NAV_ITEMS, site } from '@/lib/config/site'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { BrandLockup } from './brand-lockup'
import { hasHeroBackdropFor } from './hero-backdrop-routes'
import { LanguageSwitcher } from './language-switcher'

const MOBILE_PANEL_ID = 'mobile-nav-panel'
const MOBILE_PANEL_TITLE_ID = 'mobile-nav-panel-title'

const SCROLL_THRESHOLD = 40

// Şeffaf-üzeri-hero tedavisi güvenli değildir: yalnızca gerçek bir tam-taşma
// koyu hero sayfanın en üstünde varken uygulanmalı — aksi halde (görselsiz
// PageHero sayfalarında ve 2026-08-13'ten beri ana sayfada) `text-background`
// logosu/menüsü krem zemin üzerinde görünmez olur. Hangi rotaların koyu hero'su
// olduğu `hero-backdrop-routes.ts`'te statik olarak bildirilir; oradaki uzun
// notta bu listenin neden bir DOM sezgiselliğinin yerini aldığı anlatılır.
//
// KOMPOZİSYON (kullanıcı isteği, 2026-08-13): navbar iki satırlı ve tamamen
// ORTALANMIŞ — üstte büyük marka lockup'ı, altında 3 maddelik gezinme şeridi.
// Yardımcı denetimler (Instagram, arama, dil, CTA) marka satırının iki ucunda
// durur; marka mutlak konumla tam ortada kalır, böylece iki uçtaki grupların
// genişliği farklı olduğunda bile ortalama kaymaz.
export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const hasHeroBackdrop = hasHeroBackdropFor(pathname)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        // Opak hâlde ayrım GÖLGEYLE DEĞİL hairline ile yapılır: navbar da
        // sistemin "galeri çerçevesi" dilinin bir parçası (bkz. globals.css
        // `.frame`). Kum tonu bir çizgi burada yeterince ayırmıyordu — siyah
        // hairline navbar'ı sayfadan net biçimde koparır.
        transparent ? 'border-transparent bg-transparent' : 'border-text bg-background',
      )}
    >
      <div className="container-page relative flex h-24 items-center justify-between gap-8 lg:h-32">
        <div className="flex items-center gap-5">
          <a
            aria-label={t('instagramLabel')}
            className="shrink-0"
            href={site.instagram}
            rel="noopener noreferrer"
            target="_blank"
          >
            <InstagramIcon
              className={cn(
                'size-5 transition-colors duration-300',
                transparent ? 'text-background/85 hover:text-background' : 'text-muted hover:text-text',
              )}
            />
          </a>
        </div>

        <Link
          aria-current={pathname === '/' ? 'page' : undefined}
          className="absolute left-1/2 -translate-x-1/2"
          href="/"
        >
          <BrandLockup size="nav" transparent={transparent} />
        </Link>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 lg:flex">
            <LanguageSwitcher transparent={transparent} />
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
            <Menu
              className={cn('size-6 transition-colors duration-300', transparent ? 'text-background' : 'text-text')}
            />
          </button>
        </div>
      </div>

      <nav
        aria-label={t('primary')}
        className={cn(
          'hidden h-16 items-center justify-center gap-16 border-t transition-colors duration-300 lg:flex',
          transparent ? 'border-background/25' : 'border-text/15',
        )}
      >
        {PRIMARY_NAV_ITEMS.map((item) => (
          <Link
            aria-current={pathname === item.href ? 'page' : undefined}
            className={cn(
              // Aralıklı büyük harf grotesk — posterin "WELLNESS CLUB"
              // satırının dili (zine yönü, 2026-09-05). Cümle düzeni bir ara
              // denenmişti; poster kompozisyonunun yanında fazla nötr kalıyor
              // ve navbar'ı sistemin geri kalanından kopartıyordu.
              'relative text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300',
              // Aktif sayfanın altında elle çekilmiş gibi duran kısa bir çizgi.
              // Ayrı bir öğe değil `::after`: gezinme bağlantısının kutusunu
              // büyütmeden çizgiyi konumlandırmanın tek yolu.
              'after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 hover:after:w-full',
              pathname === item.href && 'after:w-full',
              transparent ? 'text-background/80 hover:text-background' : 'text-muted hover:text-text',
              pathname === item.href && (transparent ? 'text-background' : 'text-text'),
            )}
            href={item.href}
            key={item.key}
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>

      {open && (
        <div
          aria-labelledby={MOBILE_PANEL_TITLE_ID}
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-background lg:hidden"
          id={MOBILE_PANEL_ID}
          ref={panelRef}
          role="dialog"
        >
          <div className="container-page flex h-24 items-center justify-between">
            <span id={MOBILE_PANEL_TITLE_ID}>
              <BrandLockup size="sm" />
            </span>
            <button aria-label={t('closeMenu')} onClick={() => setOpen(false)} ref={closeButtonRef} type="button">
              <X className="size-6 text-text" />
            </button>
          </div>
          <nav aria-label={t('primary')} className="container-page mt-6 flex flex-col">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <Link
                aria-current={pathname === item.href ? 'page' : undefined}
                className="border-b border-text/20 py-5 font-heading text-3xl font-bold tracking-[-0.02em] text-text"
                href={item.href}
                key={item.key}
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
