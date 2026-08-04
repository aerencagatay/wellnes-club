import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Zeytin dolgu + krem metin = 5.90:1 (bkz. editorial redesign brief §2)
  primary: 'bg-olive text-background hover:bg-olive/90',
  secondary: 'bg-dark text-background hover:bg-dark/90',
  ghost: 'bg-transparent text-text border border-text/20 hover:border-text/50',
}

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

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
