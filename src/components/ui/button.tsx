import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Turkuaz zemin + koyu metin = 7.72:1
  primary: 'bg-accent text-ink hover:bg-accent-hover',
  secondary: 'bg-ink text-cream hover:bg-ink-2',
  ghost: 'bg-transparent text-ink border border-ink/20 hover:border-ink/50',
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
        <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href}>
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
