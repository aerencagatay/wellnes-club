import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// Hap biçimi + yumuşak geçiş — filtre/etiket kontrolleri MagicUI'de daima hap.
const BASE =
  'inline-flex items-center rounded-full border px-4 py-2 text-sm transition-all duration-200 ease-out'

export function Chip({
  active = false,
  children,
  ...rest
}: { active?: boolean; children: ReactNode } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      aria-pressed={active}
      className={`${BASE} ${active ? 'border-text bg-text text-background font-semibold' : 'border-text/20 text-muted hover:border-text/40'}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}
