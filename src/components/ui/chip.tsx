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
      className={`${BASE} ${active ? 'border-accent bg-accent text-ink font-semibold' : 'border-border text-ink-3 hover:border-ink/40'}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}
