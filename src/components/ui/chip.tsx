import type { ComponentPropsWithoutRef, ReactNode } from 'react'

const BASE = 'inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200'

export function Chip({
  active = false,
  children,
  ...rest
}: { active?: boolean; children: ReactNode } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      aria-pressed={active}
      className={`${BASE} ${active ? 'border-olive bg-olive text-background font-semibold' : 'border-sand text-muted hover:border-text/40'}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}
