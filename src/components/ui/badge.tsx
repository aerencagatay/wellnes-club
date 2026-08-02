import type { ReactNode } from 'react'

// text-olive/text-coral (Tailwind'in düz vurgu tonları) kendi arka planlarında WCAG
// AA'nın 4.5:1 eşiğini karşılamaz (bkz. globals.css'teki -deep token yorumu); -deep
// sürümleri kullanılır — bu, --color-accent için zaten uygulanan kuralın aynısı.
const TONES = {
  olive: 'bg-olive/12 text-olive-deep',
  coral: 'bg-coral/14 text-coral-deep',
  amber: 'bg-amber/16 text-ink-3',
  neutral: 'bg-ink/8 text-ink-3',
} as const

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
