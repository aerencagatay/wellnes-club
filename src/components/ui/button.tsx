import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Zeytin dolgu + krem metin = 5.90:1 (bkz. editorial redesign brief §2).
  // `shadow-*` + `hover:-translate-y-px` MagicUI'nin buton dilinden: düz bir
  // renk bloğu yerine zeminden hafifçe kalkan bir yüzey.
  primary: 'bg-olive text-background shadow-[var(--shadow-btn)] hover:bg-olive/90 hover:shadow-[var(--shadow-btn-hover)]',
  secondary: 'bg-text text-background shadow-[var(--shadow-btn)] hover:bg-text/90 hover:shadow-[var(--shadow-btn-hover)]',
  ghost: 'bg-background/60 text-text border border-text/12 shadow-[var(--shadow-btn-subtle)] hover:border-text/25 hover:bg-background',
}

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
}

// TİPOGRAFİ NOTU: buton metni eskiden `text-xs uppercase tracking-[0.08em]`
// idi. Büyük harf + geniş harf aralığı, keskin köşelerden bile daha güçlü
// biçimde 2010'lar editoryal dilini işaret ediyordu (kullanıcı geri bildirimi,
// 2026-08-14). MagicUI'nin buton dili cümle düzeni + orta ağırlık + normal
// aralık — marka başlıklarının Montserrat ince/geniş kimliği KORUNUR, değişen
// yalnızca kontrollerin dili.
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] font-medium tracking-normal transition-all duration-200 ease-out disabled:opacity-45 disabled:pointer-events-none disabled:shadow-none hover:-translate-y-px active:translate-y-0'

type Props = {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
  className?: string
  /**
   * MagicUI ShimmerButton uyarlaması: butonun üzerinden yavaşça geçen ışık
   * bandı (bkz. globals.css `.shimmer`). Sayfanın BİRİNCİL eylemine ayrılmıştır
   * — her butona verilirse vurgu anlamını yitirir. Hareket azaltma isteğinde
   * band CSS tarafında tamamen kaldırılır.
   */
  shimmer?: boolean
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  shimmer = false,
  children,
  className = '',
  ...rest
}: Props) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], shimmer && 'shimmer', className)
  // `disabled` bir `href` ile birlikte gelirse href yok sayılır: gerçek, tam
  // işlevsiz bir `<button disabled>` her zaman kazanır. Aksi halde `<a
  // disabled>` / `<Link disabled>` üretilirdi — `disabled` niteliği anchor'da
  // hiçbir şey yapmaz ve CSS'teki `:disabled` sözde sınıfı da anchor'ları
  // eşlemez, yani hem normal görünen hem de hâlâ tıklanabilir kalan, yanıltıcı
  // bir kontrol ortaya çıkardı. Bugünkü tek `disabled` kullanım yerleri zaten
  // `href` geçmiyor; bu yalnızca gelecekteki çağıranlara karşı bir güvenlik.
  if (href && !disabled) {
    const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    if (external) {
      return (
        <a
          className={classes}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          {...(rest as Omit<ComponentPropsWithoutRef<'a'>, 'href'>)}
        >
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href} {...(rest as Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>)}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
