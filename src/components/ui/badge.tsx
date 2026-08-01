import type { ReactNode } from 'react'

const TONES = {
  olive: 'bg-olive/12 text-olive',
  coral: 'bg-coral/14 text-coral',
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
