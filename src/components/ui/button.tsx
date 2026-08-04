import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Zeytin dolgu + krem metin = 5.90:1 (bkz. editorial redesign brief §2)
  primary: 'bg-olive text-background hover:bg-olive/85',
  secondary: 'bg-text text-background hover:bg-text/85',
  ghost: 'bg-transparent text-text border border-text/25 hover:border-text/60',
}

const SIZES: Record<Size, string> = {
  md: 'px-8 py-4',
  lg: 'px-10 py-5',
}

const BASE =
  'rounded-none inline-flex items-center justify-center gap-2 text-xs font-normal uppercase tracking-[0.08em] transition-[background-color,border-color,color] duration-200 disabled:opacity-50 disabled:pointer-events-none'

type Props = {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>

export function Button({ variant = 'primary', size = 'md', href, children, className = '', ...rest }: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (href) {
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
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
