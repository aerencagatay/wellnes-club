import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

/**
 * PILL CTA — DESIGN.md'nin imza buton formu.
 *
 * Kurallar (referans sistemden birebir): tam pill yarıçapı, DOLGU renk, beyaz
 * metin, gradient YOK, gölge YOK, kenarlık YOK. Sistemin tek eğrisi budur;
 * geri kalan her şey keskin köşelidir.
 *
 * RENK SEÇİMİ — `primary` neden #B4501A (orange-deep), posterin #E8792B'si
 * değil: dolgulu bir butonun üzerindeki metin AA'yı geçmek zorundadır.
 * Posterin güneş turuncusu beyaz metinle 2.92:1 verir; DESIGN.md'nin önerdiği
 * #FF7701 ise 2.66:1. İkisi de okunmaz. `--color-orange-deep` 5.12:1 verir ve
 * hâlâ net biçimde turuncudur. Poster turuncusu dekoratif yüzeylerde
 * (güneş, doodle, ayraç) olduğu gibi kullanılır.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-orange-deep text-white hover:bg-[#9C4415]',
  // Zeytin dolgu + krem metin = 7.46:1.
  secondary: 'bg-olive text-background hover:bg-[#3E4B31]',
  // Tek "çerçeveli" varyant: dolgu yerine hairline. Gölge değil, kenarlık
  // kalınlaşmasıyla tepki verir — sistemin ayrım dili bu.
  ghost: 'bg-transparent text-text border border-text hover:bg-text hover:text-background',
}

const SIZES: Record<Size, string> = {
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-[15px]',
}

/**
 * TİPOGRAFİ: Inter, orta-kalın, NORMAL harf aralığı, cümle düzeni. Büyük harf
 * + geniş aralık bilinçli olarak kullanılmaz — o dil sitede yalnızca
 * `.type-eyebrow`a ve metadata satırlarına ayrılmıştır; butonlara da verilirse
 * ayrım anlamını yitirir.
 *
 * `-translate-y-px` hover'da tek piksellik bir kalkma: gölgesiz bir sistemde
 * "bu tıklanabilir" geri bildirimini veren tek hareket bu.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] font-semibold tracking-normal transition-[background-color,color,border-color,transform] duration-200 ease-out disabled:opacity-45 disabled:pointer-events-none hover:-translate-y-px active:translate-y-0'

type Props = {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  children,
  className = '',
  ...rest
}: Props) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)
  // `disabled` bir `href` ile birlikte gelirse href yok sayılır: gerçek, tam
  // işlevsiz bir `<button disabled>` her zaman kazanır. Aksi halde `<a
  // disabled>` / `<Link disabled>` üretilirdi — `disabled` niteliği anchor'da
  // hiçbir şey yapmaz ve CSS'teki `:disabled` sözde sınıfı da anchor'ları
  // eşlemez, yani hem normal görünen hem de hâlâ tıklanabilir kalan, yanıltıcı
  // bir kontrol ortaya çıkardı.
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
